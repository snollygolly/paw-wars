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

module.exports.getLife = function* getLife(life){
  // set up the connection
  yield createConnection();
  // check to see if the document exists
  let result = yield r.table('lives').get(life.id).run(connection);
  if (result === null){
    throw new Error("Life document not found / lifeModel.getLife");
  }
  connection.close();
  //console.log("* getLife:", result);
  return result;
}

module.exports.doMarketTransaction = function* doMarketTransaction(life, transaction){
  // set up the connection
  yield createConnection();
  // check to see if the document exists
  let result = yield r.table('lives').get(life.id).run(connection);
  if (result === null){
    throw new Error("Life document not found / lifeModel.doMarketTransaction");
  }
  // make sure that quatity is available
  connection.close();
  // start to error check the transactions
  // first, see what they want to do, and see if the units are available
  if (transaction.type == "buy"){
    let listing = getObjFromID(transaction.item, life.prices.market);

  }else if (transaction.type == "sell"){

  }
  //console.log("* getLife:", result);
  return result;
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
  throw new Error(`No object id match (${id}) / lifeModel.getObjFromID`);
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
  life.listings.market = generateMarketListing();
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
