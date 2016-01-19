'use strict';

const chai = require('chai');
const expect = chai.expect;

const game = require('../game.json');
module.exports.common = require('../helpers/common');
// main model
module.exports.model = require('../models/game_life');
// game sub models
module.exports.market = require('../models/game/market');
module.exports.airport = require('../models/game/airport');
module.exports.bank = require('../models/game/bank');
// JSON data
module.exports.places = require('../models/game/places.json');
module.exports.items = require('../models/game/items.json');
// for setting testing values
module.exports.config = {
  UNITS: 10,
  AMOUNT: 500,
  ITEM: module.exports.items[0],
  PLAYER: {
    id: "testing"
  },
  LOCATION: {
    location: module.exports.places[0],
    destination: module.exports.places[10]
  },
  GAME: game
}

// test modules
const lifeTest = require('./game/life');
const marketTest = require('./game/market');
const airportTest = require('./game/airport');
const bankTest = require('./game/bank');
// negative (error) test modules
const marketTestErrors = require('./game/market-errors');

// start testing by generating a life
let life;

// testing to make sure life has all components
life = cycleLife();
describe('Life Model - Base Validation', () => {lifeTest.describeBaseValidation(life)});
life = cycleLife();
describe('Life Model - Starting Validation', () => {lifeTest.describeStartingValidation(life)});
life = cycleLife();
describe('Life Model - Current Validation', () => {lifeTest.describeCurrentValidation(life)});
life = cycleLife();
describe('Life Model - Listing Validation', () => {lifeTest.describeListingValidation(life)});
life = cycleLife();
describe('Life Model - Actions Validation', () => {lifeTest.describeActionsValidation(life)});

// testing the market
life = cycleLife();
describe('Market - Listings Validation', () => {marketTest.describeListingsValidation(life)});
life = cycleLife();
describe('Market - Transaction Validation (Buy)', () => {marketTest.describeBuyTransactionValidation(life)});
// set up life
life = cycleLife();
life = module.exports.market.doMarketTransaction(life, marketTest.makeTransaction("buy"));
describe('Market - Transaction Validation (Sell)', () => {marketTest.describeSellTransactionValidation(life)});
// errors
life = cycleLife();
describe('Bank - Transaction Error Validation (Buy)', () => {marketTestErrors.describeBuyMarketErrors(life)});

// testing the bank
life = cycleLife();
describe('Bank - Finance Validation', () => {bankTest.describeFinanceValidation(life)});
life = cycleLife();
describe('Bank - Transaction Validation (Deposit)', () => {bankTest.describeDepositTransactionValidation(life)});
// set up withdraw
life = cycleLife();
life = module.exports.bank.doBankTransaction(life, bankTest.makeTransaction("deposit"));
describe('Bank - Transaction Validation (Withdraw)', () => {bankTest.describeWithdrawTransactionValidation(life)});
// set up repay
life = cycleLife();
life = module.exports.bank.doBankTransaction(life, bankTest.makeTransaction("deposit"));
describe('Bank - Lending Validation (Repay)', () => {bankTest.describeRepayLendingValidation(life)});
// set up borrow
life = cycleLife();
describe('Bank - Lending Validation (Repay)', () => {bankTest.describeBorrowLendingValidation(life)});

// testing the airport
life = cycleLife();
describe('Airport - Listings Validation', () => {airportTest.describeAirportValidation(life)});
life = cycleLife();
describe('Airport - Transaction Validation (Flight)', () => {airportTest.describeFlightValidation(life)});

function cycleLife(){
  return module.exports.model.generateLife(module.exports.config.PLAYER, module.exports.config.LOCATION);
}
