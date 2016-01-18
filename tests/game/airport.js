'use strict';

const expect = require('chai').expect;

const main = require('../main');
const config = main.config
const common = main.common;

const airport = main.airport;

module.exports.describeAirportValidation = function describeAirportValidation(life) {
  for (let listing of life.listings.airport){
    it('listing [' + listing.id + '] should have a valid airport object', function hasValidAirportObj(done) {
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
}
module.exports.describeFlightValidation = function describeFlightValidation(life) {
  life = JSON.parse(JSON.stringify(life));
  const oldLife = JSON.parse(JSON.stringify(life));
  // old listing is actually the DESTINATION location object, but from the old life
  let oldListing = common.getObjFromID(config.LOCATION.destination.id, oldLife.listings.airport);
  let flight = {
		id: config.PLAYER.id,
		destination: config.LOCATION.destination.id
	};
  let newLife = airport.doAirportFly(life, flight)

  it('airport should accept a flight', function acceptsAirportFlight(done) {
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
}
