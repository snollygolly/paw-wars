"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const airport = main.airport;

let life;

describe("Airport - Transaction Error Validation (Flight)", () => {
	let oldLife;
	let oldListing;
	let locationID;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		locationID = oldLife.listings.airport[0].id;
		oldListing = common.getObjFromID(locationID, oldLife.listings.airport);
	});

	it("airport should refuse flight if destination is invalid", (done) => {
		const flight = {
			id: config.PLAYER.id,
			destination: "XXX"
		};
		// this should be invalid
		const newLife = airport.doAirportFly(oldLife, flight);
		// check for errors
		expect(newLife).to.have.property("error");
		return done();
	});

	it("airport should refuse flight if not enough cash", (done) => {
		const flight = {
			id: config.PLAYER.id,
			destination: locationID
		};
		// this should be invalid
		oldLife.current.finance.cash = 1;
		const newLife = airport.doAirportFly(oldLife, flight);
		// check for errors
		expect(newLife).to.have.property("error");
		return done();
	});
});
