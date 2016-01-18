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

describe('Airport - Listings Validation', function describeAirportValidation() {
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
      expect(common.isWholeNumber(listing.price)).to.be.true;
      // size
      expect(listing).to.have.property('size');
      expect(listing.size).to.be.a('number');
      expect(listing.size).to.be.at.least(0);
      expect(common.isWholeNumber(listing.size)).to.be.true;
      // flight time
      expect(listing).to.have.property('flight_time');
      expect(listing.flight_time).to.be.a('number');
      expect(listing.flight_time).to.be.at.least(0);
      expect(common.isWholeNumber(listing.flight_time)).to.be.true;
      // flight number
      expect(listing).to.have.property('flight_number');
      expect(listing.flight_number).to.be.a('string');
      return done();
    });
  }
});
