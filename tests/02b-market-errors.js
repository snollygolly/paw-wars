"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const market = main.market;

let life;

describe("Market - Transaction Error Validation (Buy)", () => {
	let oldLife;
	let oldListing;
	let oldInventory;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		oldListing = common.getObjFromID(config.ITEM.id, oldLife.listings.market);
		oldInventory = {
			id: config.ITEM.id,
			units: 0
		};
	});

	it("market should refuse buy order if not enough storage", (done) => {
		const transaction = makeTransaction("buy");
		oldLife.current.storage.available = 1;
		const newLife = market.doMarketTransaction(oldLife, transaction);
		// check for errors
		expect(newLife).to.have.property("error");
		return done();
	});

	it("market should refuse buy order if not enough available", (done) => {
		const transaction = makeTransaction("buy");
		oldLife.current.storage.available = config.GAME.market.starting_storage;
		oldLife.current.finance.cash = Math.round((oldListing.units + 100) * oldListing.price) + 10;
		transaction.units = oldListing.units + 100;
		const newLife = market.doMarketTransaction(oldLife, transaction);
		// check for errors
		expect(newLife).to.have.property("error");
		return done();
	});

	it("market should refuse buy order if not enough cash", (done) => {
		const transaction = makeTransaction("buy");
		oldLife.current.finance.cash = 1;
		const newLife = market.doMarketTransaction(oldLife, transaction);
		// check for errors
		expect(newLife).to.have.property("error");
		return done();
	});
});

describe("Market - Transaction Error Validation (Buy)", () => {
	let oldLife;
	let oldListing;
	let oldInventory;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		oldListing = common.getObjFromID(config.ITEM.id, oldLife.listings.market);
		oldInventory = {
			id: config.ITEM.id,
			units: 0
		};
	});

	it("market should refuse sell order if not enough inventory", (done) => {
		const transaction = makeTransaction("sell");
		transaction.units = config.GAME.market.starting_storage + 100;
		const newLife = market.doMarketTransaction(oldLife, transaction);
		// check for errors
		expect(newLife).to.have.property("error");
		return done();
	});
});

function makeTransaction(type) {
	return {
		id: "testing",
		type: type,
		item: config.ITEM.id,
		units: config.UNITS
	};
}
