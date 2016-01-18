'use strict';

const chai = require('chai');
const expect = chai.expect;
const common = require('../helpers/common');
const model = require('../models/game_life');
const airport = require('../models/game/airport');
const places = require('../models/game/places.json');
const items = require('../models/game/items.json');

// generate a new life with the player id of "testing" and start in the first place on the list
const UNITS = 10;
const ITEM = items[0];
const PLAYER = {
  id: "testing"
};
const LOCATION = {
  location: places[0],
  destination: places[10]
};
const life = model.generateLife(PLAYER, LOCATION);

let newLife;
// this is required because evidently you CAN change a const if you're crafty enough
let oldLife = JSON.parse(JSON.stringify(life));

describe('Airport - Listings Validation', function describeAirportValidation() {
  for (let listing of life.listings.airport){
    it('listing [' + listing.id + '] should have a valid airport object', function hasValidAirportObj(done) {
      validateListing(listing);
      return done();
    });
  }
});

describe('Airport - Transaction Validation (Flight)', function describeFlightValidation() {
  // old listing is actually the DESTINATION location object, but from the old life
  let oldListing = common.getObjFromID(LOCATION.destination.id, oldLife.listings.airport);
  let flight = {
		id: PLAYER.id,
		destination: LOCATION.destination.id
	};

  it('airport should accept a flight', function acceptsAirportFlight(done) {
    newLife = airport.doAirportFly(life, flight);
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('flight should cause turn to advance', function flightTurnAdvance(done) {
    // set up
    let newTurn = oldLife.current.turn + oldListing.flight_time;
    expect(newLife.current.turn).to.equal(newTurn);
    return done();
  });

  it('flight should cause listings to regenerate', function flightListingsRegen(done) {
    // set up
    let oldListing = oldLife.listings.airport[0];
    // make sure it's changed
    expect(newLife.listings.airport[0]).to.not.equal(oldListing);
    // and make sure that change results in a valid listing
    validateListing(newLife.listings.airport[0]);
    return done();
  });

  it('flight should update the player cash', function cashValidation(done) {
    // set up
    let newCash = Math.round(oldLife.current.finance.cash - oldListing.price);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.cash).to.be.a('number');
    expect(newLife.current.finance.cash).to.be.at.least(0);
    expect(newLife.current.finance.cash).to.equal(newCash);
    expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
    return done();
  });

  it('flight should move the player location', function locationValidation(done) {
    // set up
    let newLocation = oldListing;
    expect(newLife.current.location).to.be.an('object');
    // a full comparison of the object probably isn't needed, id and size should work
    expect(newLife.current.location.id).to.equal(newLocation.id);
    expect(newLife.current.location.size).to.equal(newLocation.size);
    return done();
  });

  it('flight should update the player actions', function actionValidation(done) {
    // set up
    let newAction = newLife.actions.pop();
    // turn
    expect(newAction).to.have.property('turn');
    expect(newAction.turn).to.be.a('number');
    expect(newAction.turn).to.equal(oldLife.current.turn);
    // type
    expect(newAction).to.have.property('type');
    expect(newAction.type).to.equal('airport');
    // data
    expect(newAction).to.have.property('data');
    expect(newAction.data).to.be.an('object');
    // data.id
    expect(newAction.data).to.have.property('id');
    expect(newAction.data.id).to.equal(flight.destination);
    // data.price
    expect(newAction.data).to.have.property('price');
    expect(newAction.data.price).to.equal(oldListing.price);
    expect(newAction.data.price).to.be.a('number');
    expect(newAction.data.price).to.be.at.least(0);
    expect(common.isWholeNumber(newAction.data.price)).to.be.true;
    return done();
  });
});

function validateListing(listing){
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
}
