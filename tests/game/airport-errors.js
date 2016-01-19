'use strict';

const expect = require('chai').expect;

const main = require('../main');
const config = main.config
const common = main.common;

const airport = main.airport;

module.exports.describeFlightAirportErrors = function describeFlightAirportErrors(life) {
  const oldLife = JSON.parse(JSON.stringify(life));
  // old listing is actually the DESTINATION location object, but from the old life
  let oldListing = common.getObjFromID(config.LOCATION.destination.id, oldLife.listings.airport);

  it('airport should refuse flight if destination is invalid', function refuseFlight(done) {
    let flight = {
      id: config.PLAYER.id,
      destination: "XXX"
    };
    // this should be invalid
    let newLife = airport.doAirportFly(oldLife, flight);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });

  it('airport should refuse flight if not enough cash', function refuseFlight(done) {
    let flight = {
      id: config.PLAYER.id,
      destination: config.LOCATION.destination.id
    };
    // this should be invalid
    oldLife.current.finance.cash = 1;
    let newLife = airport.doAirportFly(oldLife, flight);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });
}
