'use strict';

const expect = require('chai').expect;

const main = require('../main');
const config = main.config
const common = main.common;

const market = main.market;

module.exports.describeListingsValidation = function describeListingsValidation(life) {
  expect(life).to.not.be.undefined;
  expect(life).to.have.property('listings');
  expect(life.listings).to.have.property('market');
  expect(life.listings.market).to.be.an('array');
  for (let listing of life.listings.market){
    it('listing [' + listing.id + '] should have a valid market object', function hasValidMarketObj(done) {
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
}

module.exports.describeBuyTransactionValidation = function describeBuyTransactionValidation(life) {
  const oldLife = JSON.parse(JSON.stringify(life));
  let oldListing = common.getObjFromID(config.ITEM.id, oldLife.listings.market);
  let oldInventory = {
    id: config.ITEM.id,
    units: 0
  }
  let transaction = module.exports.makeTransaction("buy");
  let newLife = market.doMarketTransaction(life, transaction);

  it('market should accept a buy transaction', function acceptsMarketTransaction(done) {
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('market should update the listing units', function listingUnitValidation(done) {
    // set up
    let newListing = common.getObjFromID(config.ITEM.id, newLife.listings.market);
    let newUnits = oldListing.units - config.UNITS;
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
    let newInventory = common.getObjFromID(config.ITEM.id, newLife.current.inventory);
    let newUnits = oldInventory.units + config.UNITS;
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
    let newCash = Math.round(oldLife.current.finance.cash - (oldListing.price * config.UNITS));
    // make sure the cash updated after the buy
    expect(newLife.current.finance.cash).to.be.a('number');
    expect(newLife.current.finance.cash).to.be.at.least(0);
    expect(newLife.current.finance.cash).to.equal(newCash);
    expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
    return done();
  });

  it('market should update the player storage', function storageValidation(done) {
    // set up
    let newStorage = oldLife.current.storage.available - config.UNITS;
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
}

module.exports.describeSellTransactionValidation = function describeSellTransactionValidation(life) {
  let oldLife = JSON.parse(JSON.stringify(life));
  let oldListing = common.getObjFromID(config.ITEM.id, oldLife.listings.market);
  let oldInventory = {
    id: config.ITEM.id,
    units: config.UNITS
  }
  let transaction = module.exports.makeTransaction("sell");
  let newLife = market.doMarketTransaction(life, transaction);

  it('market should accept a sell transaction', function acceptsMarketTransaction(done) {
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('market should update the listing units', function listingUnitValidation(done) {
    // set up
    let newListing = common.getObjFromID(config.ITEM.id, newLife.listings.market);
    let newUnits = oldListing.units + config.UNITS;
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
    let newInventory = common.getObjFromID(config.ITEM.id, newLife.current.inventory);
    let newUnits = oldInventory.units - config.UNITS;
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
    let newCash = oldLife.current.finance.cash + (oldListing.price * config.UNITS);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.cash).to.be.a('number');
    expect(newLife.current.finance.cash).to.be.at.least(0);
    expect(newLife.current.finance.cash).to.equal(newCash);
    expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
    return done();
  });

  it('market should update the player storage', function storageValidation(done) {
    // set up
    let newStorage = oldLife.current.storage.available + config.UNITS;
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
}

module.exports.makeTransaction = function makeTransaction(type){
  return {
    id: "testing",
    type: type,
    item: config.ITEM.id,
    units: config.UNITS
  };
}