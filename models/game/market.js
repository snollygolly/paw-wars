"use strict";

const config = require('../../config.json');
const items = require('./items.json');
const common = require('../../helpers/common');
const model = require('../game_life.js');

module.exports.doMarketTransaction = function* doMarketTransaction(id, transaction){
  let life = yield model.getLife(id);
  // start to error check the transactions
  // first, see what they want to do, and see if the units are available
  let listing = common.getObjFromID(transaction.item, life.listings.market);
  let inventory = common.getObjFromID(transaction.item, life.current.inventory);
  // figure out the total price
  let totalPrice = transaction.units * listing.price;
  if (inventory === false){
    // we searched the inventory for this object, but didn't find it, lets make it
    inventory = {
      id: listing.id,
      units: 0
    }
    life.current.inventory.push(inventory);
  }
  if (transaction.type == "buy"){
    // TODO: check for available space in inventory
    if (transaction.units > listing.units){
      // they want more than we have
      return {error: true, message: "Transaction buys more units than available"};
    }
    // check their money (keep in mind, savings doesn't count. dealers don't take checks)
    if (totalPrice > Number(life.current.finance.cash)){
      return {error: true, message: "Transaction requests more units than life can afford"};
    }
    // adjust the user's money
    life.current.finance.cash = (Number(life.current.finance.cash) - totalPrice).toFixed(2);
    // adjust the listing's stock
    listing.units -= transaction.units;
    // adjust the inventory stock
    inventory.units += transaction.units;
  }else if (transaction.type == "sell"){
    let inventory = common.getObjFromID(transaction.item, life.current.inventory);
    if (transaction.units > inventory.units){
      return {error: true, message: "Transaction sells more units than available"};
    }
    // adjust the user's money
    life.current.finance.cash = (Number(life.current.finance.cash) + totalPrice).toFixed(2);
    // adjust the listing's stock
    listing.units += transaction.units;
    // adjust the inventory stock
    inventory.units -= transaction.units;
  }
  // save it back to the array
  life.listings.market = common.replaceObjFromArr(listing, life.listings.market);
  life.current.inventory = common.replaceObjFromArr(inventory, life.current.inventory);
  life.actions.push({
    turn: life.current.turn,
    type: "market",
    data: transaction
  })
  // save the new life
  life = yield model.replaceLife(life);
  //console.log("* doMarketTransaction:", life);
  return life;
}

module.exports.generateMarketListings = function generateMarketListings(life){
  // generates the prices and units for the market
  let priceArr = [];
  // loop through each items to set prices and qty
	for (let item of items){
    let priceObj = {
      id: item.id,
    };
		// get the mod percentage we're going to use to indicate price and qty available
		let modPerc = item.rarity / 100;
		// TODO: handle events in here, they may affect qty and price
		// generate some random numbers for price and qty
		// TODO: handle variations in price here, they may follow trends?
		let priceVariance = common.getRandomArbitrary(-0.10, 0.15);
		let modBasePrice = (config.game.base_price * priceVariance) + config.game.base_price;

		let unitVariance = common.getRandomArbitrary(-0.10, 0.15);
		let modBaseUnits = (config.game.base_units * unitVariance) + config.game.base_units;

		// calculate and set price
		let price = Math.round((modPerc * modBasePrice) * 100) / 100;
		priceObj.price = price;
		// calculate and set total units available
		let units = Math.round((1 - modPerc) * modBaseUnits);
		priceObj.units = units;
    // push to array
    priceArr.push(priceObj);
	}
  return priceArr;
}
