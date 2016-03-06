"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const market = main.market;

let life;

describe("Market - Listings Validation", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	// set up life
	const listingLife = model.generateLife(config.PLAYER, config.LOCATION);
	listingLife.testing = true;

	for (const listing of listingLife.listings.market) {
		it(`listing [${listing.id}] should have a valid market object`, (done) => {
			expect(listing).to.be.an("object");
			// id
			expect(listing).to.have.property("id");
			expect(listing.id).to.be.a("string");
			// price
			expect(listing).to.have.property("price");
			expect(listing.price).to.be.a("number");
			expect(listing.price).to.be.above(0);
			expect(common.isWholeNumber(listing.price)).to.be.true;
			// units
			expect(listing).to.have.property("units");
			expect(listing.units).to.be.a("number");
			expect(listing.units).to.be.at.least(0);
			expect(common.isWholeNumber(listing.units)).to.be.true;
			return done();
		});
	}
});

describe("Market - Transaction Validation (Buy)", () => {
	let oldLife;
	let oldListing;
	let oldInventory;
	let transaction;
	let newLife;
	let itemID;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		itemID = oldLife.listings.market[0].id;
		oldListing = common.getObjFromID(itemID, oldLife.listings.market);
		oldInventory = {
			id: itemID,
			units: 0
		};
		// give us money so we can buy this item
		oldLife.current.finance.cash += oldListing.price * config.UNITS;
		transaction = makeTransaction("buy", itemID);
		newLife = market.doMarketTransaction(oldLife, transaction);
	});

	it("market should accept a buy transaction", (done) => {
		// check for errors
		expect(newLife).to.not.have.property("error");
		return done();
	});

	it("market should update the listing units", (done) => {
		// set up
		const newListing = common.getObjFromID(itemID, newLife.listings.market);
		const newUnits = oldListing.units - config.UNITS;
		// make sure the listing updated after the buy
		expect(newListing).to.have.property("units");
		expect(newListing.units).to.be.a("number");
		expect(newListing.units).to.be.at.least(0);
		expect(newListing.units).to.equal(newUnits);
		expect(common.isWholeNumber(newListing.units)).to.be.true;
		return done();
	});

	it("market should update the player inventory", (done) => {
		// set up
		const newInventory = common.getObjFromID(itemID, newLife.current.inventory);
		const newUnits = oldInventory.units + config.UNITS;
		// make sure the listing updated after the buy
		expect(newInventory).to.have.property("units");
		expect(newInventory.units).to.be.a("number");
		expect(newInventory.units).to.be.at.least(0);
		expect(newInventory.units).to.equal(newUnits);
		expect(common.isWholeNumber(newInventory.units)).to.be.true;
		return done();
	});

	it("market should update the player cash", (done) => {
		// set up
		const newCash = Math.round(oldLife.current.finance.cash - (oldListing.price * config.UNITS));
		// make sure the cash updated after the buy
		expect(newLife.current.finance.cash).to.be.a("number");
		expect(newLife.current.finance.cash).to.be.at.least(0);
		expect(newLife.current.finance.cash).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
		return done();
	});

	it("market should update the player storage", (done) => {
		// set up
		const newStorage = oldLife.current.storage.available - config.UNITS;
		// make sure the cash updated after the buy
		expect(newLife.current.storage.available).to.be.a("number");
		expect(newLife.current.storage.available).to.be.at.least(0);
		expect(newLife.current.storage.available).to.equal(newStorage);
		expect(common.isWholeNumber(newLife.current.storage.available)).to.be.true;
		return done();
	});

	it("market should update the player awareness", (done) => {
		// set up
		const currentCountry = oldLife.current.location.country;
		let oldAwareness = 0;
		if (oldLife.current.police.awareness[currentCountry]) {
			oldAwareness += oldLife.current.police.awareness[currentCountry];
		} else {
			oldLife.current.police.awareness[currentCountry] = 0;
		}
		const newAwareness = oldAwareness + config.GAME.police.heat_rate;
		// make sure the cash updated after the buy
		expect(newLife.current.police.awareness[currentCountry]).to.be.a("number");
		expect(newLife.current.police.awareness[currentCountry]).to.be.at.least(0);
		expect(newLife.current.police.awareness[currentCountry]).to.equal(newAwareness);
		expect(common.isWholeNumber(newLife.current.police.awareness[currentCountry])).to.be.true;
		return done();
	});

	it("market should update the player actions", (done) => {
		// set up
		const newAction = newLife.actions.pop();
		// make sure the listing updated after the buy
		// turn
		expect(newAction).to.have.property("turn");
		expect(newAction.turn).to.be.a("number");
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property("type");
		expect(newAction.type).to.equal("market");
		// data
		expect(newAction).to.have.property("data");
		expect(newAction.data).to.be.an("object");
		expect(newAction.data).to.equal(transaction);
		return done();
	});
});

describe("Market - Transaction Validation (Sell)", (done) => {
	let oldLife;
	let oldListing;
	let oldInventory;
	let transaction;
	let newLife;
	let itemID;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		itemID = oldLife.listings.market[0].id;
		oldListing = common.getObjFromID(itemID, oldLife.listings.market);
		// give us money so we can buy this item
		oldLife.current.finance.cash += oldListing.price * config.UNITS;
		// start to set up a buy transaction first
		transaction = makeTransaction("buy", itemID);
		oldLife = market.doMarketTransaction(oldLife, transaction);
		// set up listings

		oldInventory = {
			id: itemID,
			units: config.UNITS
		};
		// do the sell and check start the tests
		transaction = makeTransaction("sell", itemID);
		console.log(`calling doMarketTransaction:\n oldLife:\n\n ${JSON.stringify(oldLife)} \ntransaction:\n\n ${JSON.stringify(transaction)}`);
		newLife = market.doMarketTransaction(oldLife, transaction);
	});

	it("market should accept a sell transaction", (done) => {
		// check for errors
		expect(newLife).to.not.have.property("error");
		return done();
	});

	it("market should update the listing units", (done) => {
		// set up
		const newListing = common.getObjFromID(itemID, newLife.listings.market);
		const newUnits = oldListing.units;
		// make sure the listing updated after the buy
		expect(newListing).to.have.property("units");
		expect(newListing.units).to.be.a("number");
		expect(newListing.units).to.be.at.least(0);
		expect(newListing.units).to.equal(newUnits);
		expect(common.isWholeNumber(newListing.units)).to.be.true;
		return done();
	});

	it("market should update the player inventory", (done) => {
		// set up
		const newInventory = common.getObjFromID(itemID, newLife.current.inventory);
		const newUnits = oldInventory.units - config.UNITS;
		// make sure the listing updated after the buy
		expect(newInventory).to.have.property("units");
		expect(newInventory.units).to.be.a("number");
		expect(newInventory.units).to.be.at.least(0);
		expect(newInventory.units).to.equal(newUnits);
		expect(common.isWholeNumber(newInventory.units)).to.be.true;
		return done();
	});

	it("market should update the player cash", (done) => {
		// set up
		const newCash = oldLife.current.finance.cash + (oldListing.price * config.UNITS);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.cash).to.be.a("number");
		expect(newLife.current.finance.cash).to.be.at.least(0);
		expect(newLife.current.finance.cash).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
		return done();
	});

	it("market should update the player storage", (done) => {
		// set up
		const newStorage = oldLife.current.storage.available + config.UNITS;
		// make sure the cash updated after the buy
		expect(newLife.current.storage.available).to.be.a("number");
		expect(newLife.current.storage.available).to.be.at.least(0);
		expect(newLife.current.storage.available).to.equal(newStorage);
		expect(common.isWholeNumber(newLife.current.storage.available)).to.be.true;
		return done();
	});

	it("market should update the player awareness", (done) => {
		// set up
		const currentCountry = oldLife.current.location.country;
		let oldAwareness = 0;
		if (oldLife.current.police.awareness[currentCountry]) {
			oldAwareness += oldLife.current.police.awareness[currentCountry];
		} else {
			oldLife.current.police.awareness[currentCountry] = 0;
		}
		const newAwareness = oldAwareness + config.GAME.police.heat_rate;
		// make sure the cash updated after the buy
		expect(newLife.current.police.awareness[currentCountry]).to.be.a("number");
		expect(newLife.current.police.awareness[currentCountry]).to.be.at.least(0);
		expect(newLife.current.police.awareness[currentCountry]).to.equal(newAwareness);
		expect(common.isWholeNumber(newLife.current.police.awareness[currentCountry])).to.be.true;
		return done();
	});

	it("market should update the player actions", (done) => {
		// set up
		const newAction = newLife.actions.pop();
		// make sure the listing updated after the buy
		// turn
		expect(newAction).to.have.property("turn");
		expect(newAction.turn).to.be.a("number");
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property("type");
		expect(newAction.type).to.equal("market");
		// data
		expect(newAction).to.have.property("data");
		expect(newAction.data).to.be.an("object");
		expect(newAction.data).to.equal(transaction);
		return done();
	});
});

function makeTransaction(type, itemID) {
	return {
		id: "testing",
		type: type,
		item: itemID,
		units: config.UNITS
	};
}
