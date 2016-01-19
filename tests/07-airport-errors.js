'use strict';

const expect = require('chai').expect;

const main = require('./00-main');
const config = main.config
const common = main.common;
const model = main.model;

const airport = main.airport;

let life;

describe('Airport - Transaction Error Validation (Flight)', () => {
	let oldLife;
	let oldListing;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		oldListing = common.getObjFromID(config.LOCATION.destination.id, oldLife.listings.airport);
  });

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
});
