"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const hotel = main.hotel;

let life;

describe("Hotel - Hotel Validation", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("hotel should show checked in as the starting value", (done) => {
		expect(life.current).to.have.property("hotel");
		expect(life.current.hotel).to.be.a("boolean");
		expect(life.current.hotel).to.equal(true);
		return done();
	});
});

describe("Hotel - Transaction Validation", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		life.current.hotel = false;
	});

	it("hotel should check in guests when called", (done) => {
		let newLife = JSON.parse(JSON.stringify(life));
		newLife = hotel.doHotelCheckIn(newLife);
		expect(newLife.current).to.have.property("hotel");
		expect(newLife.current.hotel).to.be.a("boolean");
		expect(newLife.current.hotel).to.equal(true);
		return done();
	});

	it("hotel should check out guests when called", (done) => {
		let newLife = JSON.parse(JSON.stringify(life));
		newLife = hotel.doHotelCheckOut(newLife);
		expect(newLife.current).to.have.property("hotel");
		expect(newLife.current.hotel).to.be.a("boolean");
		expect(newLife.current.hotel).to.equal(false);
		return done();
	});

	it("hotel should check out guests on turn change", (done) => {
		let newLife = JSON.parse(JSON.stringify(life));
		newLife = model.changeTurn(newLife, 2);
		expect(newLife.current).to.have.property("hotel");
		expect(newLife.current.hotel).to.be.a("boolean");
		expect(newLife.current.hotel).to.equal(false);
		return done();
	});
});
