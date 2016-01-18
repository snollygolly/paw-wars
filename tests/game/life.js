'use strict';

const expect = require('chai').expect;

const main = require('../main');
const config = main.config
const common = main.common;
const model = main.model;
const places = main.places;

module.exports.describeBaseValidation = function describeBaseValidation(life) {
  it('life should not be null', function isNotNull(done) {
    expect(life).to.not.be.a('null');
    return done();
  });

  it('life should have required properties', function hasRequiredProperties(done) {
    expect(life).to.be.an('object');
    expect(life).to.have.property('id');
    expect(life).to.have.property('starting');
    expect(life).to.have.property('current');
    expect(life).to.have.property('listings');
    expect(life).to.have.property('actions');
    return done();
  });

  it('life should have a valid id', function isValidID(done) {
    expect(life.id).to.be.a('string');
    let idArr = life.id.split("_");
    expect(idArr.length).to.equal(2);
    expect(idArr[0]).to.equal(config.PLAYER.id);
    // TODO: expect().to.be.a.timestamp?
    return done();
  });
}

module.exports.describeStartingValidation = function describeStartingValidation(life) {
  it('current life should have required properties', function hasRequiredProperties(done) {
    expect(life.starting).to.be.an('object');
    expect(life.starting).to.have.property('turn');
    expect(life.starting).to.have.property('event');
    expect(life.starting).to.have.property('finance');
    expect(life.starting).to.have.property('health');
    expect(life.starting).to.have.property('inventory');
    expect(life.starting).to.have.property('location');
    expect(life.starting).to.have.property('storage');
    return done();
  });

  it('current life has a valid turn', function hasValidTurn(done) {
    expect(life.starting.turn).to.be.a('number');
    return done();
  });

  it('current life has a valid event', function hasValidEvent(done) {
    expect(life.starting.event).to.be.a('string');
    return done();
  });

  it('current life has a valid finance object', function hasValidFinance(done) {
    expect(life.starting.finance).to.be.an('object');
    // cash
    expect(life.starting.finance).to.have.property('cash');
    expect(life.starting.finance.cash).to.be.a('number');
    expect(life.starting.finance.cash).to.be.at.least(0);
    expect(common.isWholeNumber(life.starting.finance.cash)).to.be.true;
    // debt
    expect(life.starting.finance).to.have.property('debt');
    expect(life.starting.finance.debt).to.be.a('number');
    expect(life.starting.finance.debt).to.be.at.least(0);
    expect(common.isWholeNumber(life.starting.finance.debt)).to.be.true;
    // savings
    expect(life.starting.finance).to.have.property('savings');
    expect(life.starting.finance.savings).to.be.a('number');
    expect(life.starting.finance.savings).to.be.at.least(0);
    expect(common.isWholeNumber(life.starting.finance.savings)).to.be.true;
    // debt interest
    expect(life.starting.finance).to.have.property('debt_interest');
    expect(life.starting.finance.debt_interest).to.be.a('number');
    expect(life.starting.finance.debt_interest).to.be.at.least(0);
    // savings interest
    expect(life.starting.finance).to.have.property('savings_interest');
    expect(life.starting.finance.savings_interest).to.be.a('number');
    expect(life.starting.finance.savings_interest).to.be.at.least(0);
    return done();
  });

  it('current life has a valid health object', function hasValidHealth(done) {
    expect(life.starting.health).to.be.an('object');
    expect(life.starting.health).to.have.property('points');
    expect(life.starting.health.points).to.be.a('number');
    expect(life.starting.health.points).to.be.above(0);
    expect(common.isWholeNumber(life.starting.health.points)).to.be.true;
    expect(life.starting.health).to.have.property('status');
    return done();
  });

  it('current life has a valid inventory array', function hasValidInventory(done) {
    expect(life.starting.inventory).to.be.an('array');
    return done();
  });

  it('current life has a valid location object', function hasValidLocation(done) {
    expect(life.starting.location).to.be.an('object');
    // city
    expect(life.starting.location).to.have.property('city');
    expect(life.starting.location.city).to.be.a('string');
    expect(life.starting.location.city).to.equal(config.LOCATION.location.city);
    // country
    expect(life.starting.location).to.have.property('country');
    expect(life.starting.location.country).to.be.a('string');
    expect(life.starting.location.country).to.equal(config.LOCATION.location.country);
    // continent
    expect(life.starting.location).to.have.property('continent');
    expect(life.starting.location.continent).to.be.a('string');
    expect(life.starting.location.continent).to.equal(config.LOCATION.location.continent);
    // ID
    expect(life.starting.location).to.have.property('id');
    expect(life.starting.location.id).to.be.a('string');
    expect(life.starting.location.id).to.equal(config.LOCATION.location.id);
    // size
    expect(life.starting.location).to.have.property('size');
    expect(life.starting.location.size).to.be.a('number');
    expect(life.starting.location.size).to.be.at.least(0);
    expect(life.starting.location.size).to.equal(config.LOCATION.location.size);
    return done();
  });

  it('current life has a valid storage object', function hasValidStorage(done) {
    expect(life.starting.storage).to.be.an('object');
    // available
    expect(life.starting.storage).to.have.property('available');
    expect(life.starting.storage.available).to.be.a('number');
    expect(life.starting.storage.available).to.be.at.least(0);
    expect(common.isWholeNumber(life.starting.storage.available)).to.be.true;
    // total
    expect(life.starting.storage).to.have.property('total');
    expect(life.starting.storage.total).to.be.a('number');
    expect(life.starting.storage.total).to.be.at.least(0);
    expect(common.isWholeNumber(life.starting.storage.total)).to.be.true;
    // make sure total is > than available always
    expect(life.starting.storage.total).to.be.at.least(life.starting.storage.available);
    return done();
  });
}

module.exports.describeCurrentValidation = function describeCurrentValidation(life) {
  it('current life should have required properties', function hasRequiredProperties(done) {
    expect(life.current).to.be.an('object');
    expect(life.current).to.have.property('turn');
    expect(life.current).to.have.property('event');
    expect(life.current).to.have.property('finance');
    expect(life.current).to.have.property('health');
    expect(life.current).to.have.property('inventory');
    expect(life.current).to.have.property('location');
    expect(life.current).to.have.property('storage');
    return done();
  });

  it('current life has a valid turn', function hasValidTurn(done) {
    expect(life.current.turn).to.be.a('number');
    return done();
  });

  it('current life has a valid event', function hasValidEvent(done) {
    expect(life.current.event).to.be.a('string');
    return done();
  });

  it('current life has a valid finance object', function hasValidFinance(done) {
    expect(life.current.finance).to.be.an('object');
    // cash
    expect(life.current.finance).to.have.property('cash');
    expect(life.current.finance.cash).to.be.a('number');
    expect(life.current.finance.cash).to.be.at.least(0);
    expect(common.isWholeNumber(life.current.finance.cash)).to.be.true;
    // debt
    expect(life.current.finance).to.have.property('debt');
    expect(life.current.finance.debt).to.be.a('number');
    expect(life.current.finance.debt).to.be.at.least(0);
    expect(common.isWholeNumber(life.current.finance.debt)).to.be.true;
    // savings
    expect(life.current.finance).to.have.property('savings');
    expect(life.current.finance.savings).to.be.a('number');
    expect(life.current.finance.savings).to.be.at.least(0);
    expect(common.isWholeNumber(life.current.finance.savings)).to.be.true;
    // debt interest
    expect(life.current.finance).to.have.property('debt_interest');
    expect(life.current.finance.debt_interest).to.be.a('number');
    expect(life.current.finance.debt_interest).to.be.at.least(0);
    // savings interest
    expect(life.current.finance).to.have.property('savings_interest');
    expect(life.current.finance.savings_interest).to.be.a('number');
    expect(life.current.finance.savings_interest).to.be.at.least(0);
    return done();
  });

  it('current life has a valid health object', function hasValidHealth(done) {
    expect(life.current.health).to.be.an('object');
    expect(life.current.health).to.have.property('points');
    expect(life.current.health.points).to.be.a('number');
    expect(life.current.health.points).to.be.above(0);
    expect(common.isWholeNumber(life.current.health.points)).to.be.true;
    expect(life.current.health).to.have.property('status');
    return done();
  });

  it('current life has a valid inventory array', function hasValidInventory(done) {
    expect(life.current.inventory).to.be.an('array');
    return done();
  });

  it('current life has a valid location object', function hasValidLocation(done) {
    expect(life.current.location).to.be.an('object');
    // city
    expect(life.current.location).to.have.property('city');
    expect(life.current.location.city).to.be.a('string');
    expect(life.current.location.city).to.equal(config.LOCATION.location.city);
    // country
    expect(life.current.location).to.have.property('country');
    expect(life.current.location.country).to.be.a('string');
    expect(life.current.location.country).to.equal(config.LOCATION.location.country);
    // continent
    expect(life.current.location).to.have.property('continent');
    expect(life.current.location.continent).to.be.a('string');
    expect(life.current.location.continent).to.equal(config.LOCATION.location.continent);
    // ID
    expect(life.current.location).to.have.property('id');
    expect(life.current.location.id).to.be.a('string');
    expect(life.current.location.id).to.equal(config.LOCATION.location.id);
    // size
    expect(life.current.location).to.have.property('size');
    expect(life.current.location.size).to.be.a('number');
    expect(life.current.location.size).to.be.at.least(0);
    expect(life.current.location.size).to.equal(config.LOCATION.location.size);
    return done();
  });

  it('current life has a valid storage object', function hasValidStorage(done) {
    expect(life.current.storage).to.be.an('object');
    // available
    expect(life.current.storage).to.have.property('available');
    expect(life.current.storage.available).to.be.a('number');
    expect(life.current.storage.available).to.be.at.least(0);
    expect(common.isWholeNumber(life.current.storage.available)).to.be.true;
    // total
    expect(life.current.storage).to.have.property('total');
    expect(life.current.storage.total).to.be.a('number');
    expect(life.current.storage.total).to.be.at.least(0);
    expect(common.isWholeNumber(life.current.storage.total)).to.be.true;
    // make sure total is > than available always
    expect(life.current.storage.total).to.be.at.least(life.current.storage.available);
    return done();
  });
}
