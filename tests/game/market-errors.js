'use strict';

const expect = require('chai').expect;

const main = require('../main');
const config = main.config
const common = main.common;

const market = main.market;

module.exports.describeBuyMarketErrors = function describeBuyMarketErrors(life) {
  life = JSON.parse(JSON.stringify(life));
  const oldLife = JSON.parse(JSON.stringify(life));
  let oldListing = common.getObjFromID(config.ITEM.id, oldLife.listings.market);
  let oldInventory = {
    id: config.ITEM.id,
    units: 0
  }

  it('market should refuse buy order if not enough storage', function refuseBuy(done) {
    let transaction = module.exports.makeTransaction("buy");
    transaction.units = config.GAME.market.starting_storage + 100;
    let newLife = market.doMarketTransaction(life, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });

  it('market should refuse buy order if not enough available', function refuseBuy(done) {
    let transaction = module.exports.makeTransaction("buy");
    transaction.units = oldListing.units + 100;
    let newLife = market.doMarketTransaction(life, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
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
