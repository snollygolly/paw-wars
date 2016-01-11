"use strict";

const config = require('../config.json');
const places = require('./places.json');
const items = require('./items.json');
const common = require('../helpers/common');
const r = require('rethinkdb');

let connection;

function* createConnection() {
  try{
    // Open a connection and wait for r.connect(...) to be resolve
    connection = yield r.connect(config.site.db);
  }
  catch(err) {
    console.error(err);
  }
}

module.exports.createLife = function* createLife (player, parameters){
  // set up the connection
  yield createConnection();
  //create the life object
  let life = generateLife(player, parameters);
  let result = yield r.table('lives').insert(life, {returnChanges: true}).run(connection);
  connection.close();
  //console.log("* createLife:", result.changes[0].new_val);
  return result.changes[0].new_val;
}

module.exports.getLife = function* getLife(id){
  // set up the connection
  yield createConnection();
  // check to see if the document exists
  let result = yield r.table('lives').get(id).run(connection);
  if (result === null){
    throw new Error("Life document not found / lifeModel.getLife");
  }
  connection.close();
  //console.log("* getLife:", result);
  return result;
}

module.exports.replaceLife = function * replaceLife(life){
  // set up the connection
  yield createConnection();
  // validate
  let valid = validateLife(life);
  // if this player object isn't valid...
  if (valid.status === false){
    // ...return the error object
    throw new Error("Player object invalid / playerModel.replacePlayer");
  }
  let result = yield r.table('lives').get(life.id).replace(life, {returnChanges: true}).run(connection);
  connection.close();
  //console.log("* replaceLife:", result.changes[0].new_val);
  return result.changes[0].new_val;
}

module.exports.doMarketTransaction = function* doMarketTransaction(id, transaction){
  let life = yield module.exports.getLife(id);
  // start to error check the transactions
  // first, see what they want to do, and see if the units are available
  let listing = getObjFromID(transaction.item, life.listings.market);
  let inventory = getObjFromID(transaction.item, life.current.inventory);
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
    if (totalPrice > life.current.finance.cash){
      return {error: true, message: "Transaction requests more units than life can afford"};
    }
    // adjust the user's money
    life.current.finance.cash -= totalPrice;
    // adjust the listing's stock
    listing.units -= transaction.units;
    // adjust the inventory stock
    inventory.units += transaction.units;
  }else if (transaction.type == "sell"){
    let inventory = getObjFromID(transaction.item, life.current.inventory);
    if (transaction.units > inventory.units){
      return {error: true, message: "Transaction sells more units than available"};
    }
    // adjust the user's money
    life.current.finance.cash += totalPrice;
    // adjust the listing's stock
    listing.units += transaction.units;
    // adjust the inventory stock
    inventory.units -= transaction.units;
  }
  // save it back to the array
  life.listings.market = replaceObjFromArr(listing, life.listings.market);
  life.current.inventory = replaceObjFromArr(inventory, life.current.inventory);
  // save the new life
  life = yield module.exports.replaceLife(life);
  //console.log("* doMarketTransaction:", life);
  return life;
}

function validateLife(life){
  if (!life.id){return {status: false, reason: "No ID"};}
  return {status: true};
}

function getObjFromID(id, searchArr){
  for (let obj of searchArr){
    if (obj.id == id){
      return obj;
    }
  }
  return false;
}

function replaceObjFromArr(obj, searchArr){
  let returnArr = [];
  for (let searchObj of searchArr){
    if (searchObj.id == obj.id){
      searchObj = obj;
    }
    returnArr.push(searchObj);
  }
  return returnArr;
}

function generateMarketListings(){
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

function generateAirportListings(){
  // generates prices for the airport
}

function generateBankListings(){
  // generates interest rates and such for the bank?
}

function generateLife(player, parameters){
  let life = {
    id: player.id + "_" + Date.now(),
    starting: {
      location: {
        id: parameters.location.id,
        city: parameters.location.city,
        country: parameters.location.country,
        continent: parameters.location.continent
      },
      health: {
        points: 100,
        status: null
      },
      finance: {
        cash: config.game.starting_cash,
        savings: 0,
        debt: config.game.starting_debt
      },
      inventory: []
    },
    current: {},
    listings: {
      market: [],
      airport: []
    },
    turns: []
  };
  life.starting.inventory.push({id: items[0].id, units: 1});
  // we just created life.  let that dwell on you for a little bit.
  // this is where it all starts.
  life.current = life.starting;
  // simulate the prices here
  life.listings.market = generateMarketListings();
  return life;
}
/*
turns: [
  {
    day: 0,
    location: {
      city: places[0].city,
      country: places[0].country,
      continent: places[0].continent
    },
    actions: [
      {
        type: "bought_item",
        meta: {
          id: items[0].id,
          units: 1
        }
      }
    ]
  }
]
*/