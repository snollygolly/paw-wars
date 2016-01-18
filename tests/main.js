'use strict';

const chai = require('chai');
const expect = chai.expect;

module.exports.common = require('../helpers/common');
module.exports.model = require('../models/game_life');
module.exports.market = require('../models/game/market');
module.exports.airport = require('../models/game/airport');
module.exports.places = require('../models/game/places.json');
module.exports.items = require('../models/game/items.json');

module.exports.config = {
  UNITS: 10,
  ITEM: module.exports.items[0],
  PLAYER: {
    id: "testing"
  },
  LOCATION: {
    location: module.exports.places[0],
    destination: module.exports.places[10]
  }
}

// test modules
const lifeTest = require('./game/life');
const marketTest = require('./game/market');
const airportTest = require('./game/airport');

// start testing by generating a life
let life;
// testing to make sure life has all components
life = cycleLife();
describe('Life Model - Base Validation', () => {lifeTest.describeBaseValidation(life)});
describe('Life Model - Starting Validation', () => {lifeTest.describeStartingValidation(life)});
describe('Life Model - Current Validation', () => {lifeTest.describeCurrentValidation(life)});
describe('Life Model - Listing Validation', () => {lifeTest.describeListingValidation(life)});
describe('Life Model - Actions Validation', () => {lifeTest.describeActionsValidation(life)});

// testing the market
life = cycleLife();
describe('Market - Listings Validation', () => {marketTest.describeListingsValidation(life)});
describe('Market - Transaction Validation (Buy)', () => {marketTest.describeBuyTransactionValidation(life)});
// set up life
let transaction = marketTest.makeBuyTransaction();
life = module.exports.market.doMarketTransaction(life, transaction);
describe('Market - Transaction Validation (Sell)', () => {marketTest.describeSellTransactionValidation(life)});

// testing the airport
life = cycleLife();
describe('Airport - Listings Validation', () => {airportTest.describeAirportValidation(life)});
describe('Airport - Transaction Validation (Flight)', () => {airportTest.describeFlightValidation(life)});

function cycleLife(){
  return module.exports.model.generateLife(module.exports.config.PLAYER, module.exports.config.LOCATION);
}
