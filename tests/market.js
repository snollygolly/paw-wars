'use strict';

const chai = require('chai');
const expect = chai.expect;
const common = require('../helpers/common');
const model = require('../models/game_life');
const market = require('../models/game/market');
const places = require('../models/game/places.json');
const items = require('../models/game/items.json');

// generate a new life with the player id of "testing" and start in the first place on the list
const UNITS = 10;
const ITEM = items[0];
const PLAYER = {
  id: "testing"
};
const LOCATION = {
  location: places[0]
};
const life = model.generateLife(PLAYER, LOCATION);

let newLife;
// this is required because evidently you CAN change a const if you're crafty enough
let oldLife = JSON.parse(JSON.stringify(life));

describe('Market - Listings Validation', function describeListingsValidation() {
  for (let listing of life.listings.market){
    it('listing [' + listing.id + '] has a valid market object', function hasValidMarketObj(done) {
      expect(listing).to.be.an('object');
      // id
      expect(listing).to.have.property('id');
      expect(listing.id).to.be.a('string');
      // price
      expect(listing).to.have.property('price');
      expect(listing.price).to.be.a('number');
      expect(listing.price).to.be.above(0);
      expect(common.isWholeNumber(listing.price)).to.be.true;
      // units
      expect(listing).to.have.property('units');
      expect(listing.units).to.be.a('number');
      expect(listing.units).to.be.at.least(0);
      expect(common.isWholeNumber(listing.units)).to.be.true;
      return done();
    });
  }
});

describe('Market - Transaction Validation (Buy)', function describeTransactionValidation() {
  let oldListing = common.getObjFromID(ITEM.id, oldLife.listings.market);
  let oldInventory = {
    id: ITEM.id,
    units: 0
  }
  let transaction = {
    id: "testing",
    type: "buy",
    item: ITEM.id,
    units: UNITS
  };

  it('market should accept a buy transaction', function acceptsMarketTransaction(done) {
    newLife = market.doMarketTransaction(life, transaction);
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('market should update the listing units', function listingUnitValidation(done) {
    // set up
    let newListing = common.getObjFromID(ITEM.id, newLife.listings.market);
    let newUnits = oldListing.units - UNITS;
    // make sure the listing updated after the buy
    expect(newListing).to.have.property('units');
    expect(newListing.units).to.be.a('number');
    expect(newListing.units).to.be.at.least(0);
    expect(newListing.units).to.equal(newUnits);
    expect(common.isWholeNumber(newListing.units)).to.be.true;
    return done();
  });

  it('market should update the player inventory', function inventoryValidation(done) {
    // set up
    let newInventory = common.getObjFromID(ITEM.id, newLife.current.inventory);
    let newUnits = oldInventory.units + UNITS;
    // make sure the listing updated after the buy
    expect(newInventory).to.have.property('units');
    expect(newInventory.units).to.be.a('number');
    expect(newInventory.units).to.be.at.least(0);
    expect(newInventory.units).to.equal(newUnits);
    expect(common.isWholeNumber(newInventory.units)).to.be.true;
    return done();
  });

  it('market should update the player cash', function cashValidation(done) {
    // set up
    let newCash = oldLife.current.finance.cash - (oldListing.price * UNITS);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.cash).to.be.a('number');
    expect(newLife.current.finance.cash).to.be.at.least(0);
    expect(newLife.current.finance.cash).to.equal(newCash);
    expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
    return done();
  });

  it('market should update the player storage', function storageValidation(done) {
    // set up
    let newStorage = oldLife.current.storage.available - UNITS;
    // make sure the cash updated after the buy
    expect(newLife.current.storage.available).to.be.a('number');
    expect(newLife.current.storage.available).to.be.at.least(0);
    expect(newLife.current.storage.available).to.equal(newStorage);
    expect(common.isWholeNumber(newLife.current.storage.available)).to.be.true;
    return done();
  });

  it('market should update the player actions', function actionValidation(done) {
    // set up
    let newAction = newLife.actions.pop();
    // make sure the listing updated after the buy
    // turn
    expect(newAction).to.have.property('turn');
    expect(newAction.turn).to.be.a('number');
    expect(newAction.turn).to.equal(oldLife.current.turn);
    // type
    expect(newAction).to.have.property('type');
    expect(newAction.type).to.equal('market');
    // data
    expect(newAction).to.have.property('data');
    expect(newAction.data).to.be.an('object');
    expect(newAction.data).to.equal(transaction);
    return done();
  });
});

describe('Market - Transaction Validation (Sell)', function describeTransactionValidation() {
  let oldListing = common.getObjFromID(ITEM.id, oldLife.listings.market);
  let oldInventory = {
    id: ITEM.id,
    units: 0
  }
  let transaction = {
    id: "testing",
    type: "sell",
    item: ITEM.id,
    units: UNITS
  };

  it('market should accept a sell transaction', function acceptsMarketTransaction(done) {
    newLife = market.doMarketTransaction(life, transaction);
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('market should update the listing units', function listingUnitValidation(done) {
    // set up
    let newListing = common.getObjFromID(ITEM.id, newLife.listings.market);
    // there's no change in units
    let newUnits = oldListing.units;
    // make sure the listing updated after the buy
    expect(newListing).to.have.property('units');
    expect(newListing.units).to.be.a('number');
    expect(newListing.units).to.be.at.least(0);
    expect(newListing.units).to.equal(newUnits);
    expect(common.isWholeNumber(newListing.units)).to.be.true;
    return done();
  });

  it('market should update the player inventory', function inventoryValidation(done) {
    // set up
    let newInventory = common.getObjFromID(ITEM.id, newLife.current.inventory);
    // there's no change in units
    let newUnits = oldInventory.units;
    // make sure the listing updated after the buy
    expect(newInventory).to.have.property('units');
    expect(newInventory.units).to.be.a('number');
    expect(newInventory.units).to.be.at.least(0);
    expect(newInventory.units).to.equal(newUnits);
    expect(common.isWholeNumber(newInventory.units)).to.be.true;
    return done();
  });

  it('market should update the player cash', function cashValidation(done) {
    // set up
    // there's no change in cash
    let newCash = oldLife.current.finance.cash;
    // make sure the cash updated after the buy
    expect(newLife.current.finance.cash).to.be.a('number');
    expect(newLife.current.finance.cash).to.be.at.least(0);
    expect(newLife.current.finance.cash).to.equal(newCash);
    expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
    return done();
  });

  it('market should update the player storage', function storageValidation(done) {
    // set up
    // there's no change in storage
    let newStorage = oldLife.current.storage.available;
    // make sure the cash updated after the buy
    expect(newLife.current.storage.available).to.be.a('number');
    expect(newLife.current.storage.available).to.be.at.least(0);
    expect(newLife.current.storage.available).to.equal(newStorage);
    expect(common.isWholeNumber(newLife.current.storage.available)).to.be.true;
    return done();
  });

  it('market should update the player actions', function actionValidation(done) {
    // set up
    let newAction = newLife.actions.pop();
    // make sure the listing updated after the buy
    // turn
    expect(newAction).to.have.property('turn');
    expect(newAction.turn).to.be.a('number');
    expect(newAction.turn).to.equal(oldLife.current.turn);
    // type
    expect(newAction).to.have.property('type');
    expect(newAction.type).to.equal('market');
    // data
    expect(newAction).to.have.property('data');
    expect(newAction.data).to.be.an('object');
    expect(newAction.data).to.equal(transaction);
    return done();
  });
});
