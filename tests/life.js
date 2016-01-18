'use strict';

const chai = require('chai');
const expect = chai.expect;
const model = require('../models/game_life');
const places = require('../models/game/places.json');

// generate a new life with the player id of "testing" and start in the first place on the list
const PLAYER = {
  id: "testing"
};
const LOCATION = {
  location: places[0]
}
const life = model.generateLife(PLAYER, LOCATION);

describe('Life Model - Base Validation', function describeBaseValidation() {
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
    expect(idArr[0]).to.equal(PLAYER.id);
    // TODO: expect().to.be.a.timestamp?
    return done();
  });
});

describe('Life Model - Current Validation', function describeCurrentValidation() {
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
    expect(isWholeNumber(life.current.finance.cash)).to.be.true;
    // debt
    expect(life.current.finance).to.have.property('debt');
    expect(life.current.finance.debt).to.be.a('number');
    expect(life.current.finance.debt).to.be.at.least(0);
    expect(isWholeNumber(life.current.finance.debt)).to.be.true;
    // savings
    expect(life.current.finance).to.have.property('savings');
    expect(life.current.finance.savings).to.be.a('number');
    expect(life.current.finance.savings).to.be.at.least(0);
    expect(isWholeNumber(life.current.finance.savings)).to.be.true;
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
    expect(isWholeNumber(life.current.health.points)).to.be.true;
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
    expect(life.current.location.city).to.equal(LOCATION.location.city);
    // country
    expect(life.current.location).to.have.property('country');
    expect(life.current.location.country).to.be.a('string');
    expect(life.current.location.country).to.equal(LOCATION.location.country);
    // continent
    expect(life.current.location).to.have.property('continent');
    expect(life.current.location.continent).to.be.a('string');
    expect(life.current.location.continent).to.equal(LOCATION.location.continent);
    // ID
    expect(life.current.location).to.have.property('id');
    expect(life.current.location.id).to.be.a('string');
    expect(life.current.location.id).to.equal(LOCATION.location.id);
    // size
    expect(life.current.location).to.have.property('size');
    expect(life.current.location.size).to.be.a('number');
    expect(life.current.location.size).to.be.at.least(0);
    expect(life.current.location.size).to.equal(LOCATION.location.size);
    return done();
  });

  it('current life has a valid storage object', function hasValidStorage(done) {
    expect(life.current.storage).to.be.an('object');
    // available
    expect(life.current.storage).to.have.property('available');
    expect(life.current.storage.available).to.be.a('number');
    expect(life.current.storage.available).to.be.at.least(0);
    expect(isWholeNumber(life.current.storage.available)).to.be.true;
    // total
    expect(life.current.storage).to.have.property('total');
    expect(life.current.storage.total).to.be.a('number');
    expect(life.current.storage.total).to.be.at.least(0);
    expect(isWholeNumber(life.current.storage.total)).to.be.true;
    // make sure total is > than available always
    expect(life.current.storage.total).to.be.at.least(life.current.storage.available);
    return done();
  });
});

describe('Life Model - Listing Validation', function describeListingValidation() {
  it('listing should have required properties', function hasRequiredProperties(done) {
    expect(life.listings).to.be.an('object');
    expect(life.listings).to.have.property('market');
    expect(life.listings).to.have.property('airport');
    return done();
  });

  it('listing has a valid market array', function hasValidMarket(done) {
    expect(life.listings.market).to.be.an('array');
    return done();
  });

  it('listing has a valid airport array', function hasValidAirport(done) {
    expect(life.listings.market).to.be.an('array');
    return done();
  });
});

describe('Life Model - Airport Listing Validation', function describeAirportValidation() {
  for (let listing of life.listings.airport){
    it('listing [' + listing.id + '] has a valid airport object', function hasValidAirportObj(done) {
      expect(listing).to.be.an('object');
      // id
      expect(listing).to.have.property('id');
      expect(listing.id).to.be.a('string');
      // price
      expect(listing).to.have.property('price');
      expect(listing.price).to.be.a('number');
      expect(listing.price).to.be.above(0);
      expect(isWholeNumber(listing.price)).to.be.true;
      // size
      expect(listing).to.have.property('size');
      expect(listing.size).to.be.a('number');
      expect(listing.size).to.be.at.least(0);
      expect(isWholeNumber(listing.size)).to.be.true;
      // flight time
      expect(listing).to.have.property('flight_time');
      expect(listing.flight_time).to.be.a('number');
      expect(listing.flight_time).to.be.at.least(0);
      expect(isWholeNumber(listing.flight_time)).to.be.true;
      // flight number
      expect(listing).to.have.property('flight_number');
      expect(listing.flight_number).to.be.a('string');
      return done();
    });
  }
});

function isWholeNumber(num){
  if (num % 1 === 0){
    return true;
  }else{
    return false;
  }
}
