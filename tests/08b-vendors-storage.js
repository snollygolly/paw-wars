"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const vendors = main.vendors;

const vendor = "storage";
let life;
let oldLife;
let newLife;
let vendorObj;
let transaction;

describe("Vendors [Storage] - Generate Stock", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.current.vendor_meta = "lucky";
		vendorObj = vendors.generateVendorListings(vendor, life);
	});

	it("storage vendor should create listing", (done) => {
		expect(vendorObj).to.be.an("object");
		return done();
	});

	it("storage stock should have the right number of units", (done) => {
		for (const stock of vendorObj.stock) {
			expect(stock.units).to.equal(config.GAME.vendors.storage.units);
		}
		return done();
	});

	it("storage stock should be priced correctly", (done) => {
		const basePrice = config.GAME.vendors.base_price * config.GAME.vendors.storage.pricing.times_base;
		const increaseRate = config.GAME.vendors.storage.pricing.increase_rate;
		let lastPrice = basePrice;
		for (const stock of vendorObj.stock) {
			expect(stock.price).to.equal(lastPrice * increaseRate);
			lastPrice = stock.price;
		}
		return done();
	});

	it("storage stock should have the correct meta information", (done) => {
		for (const stock of vendorObj.stock) {
			expect(stock.meta).to.equal(null);
		}
		return done();
	});
});

describe("Vendors [Storage] - Handle Transaction", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.current.vendor_meta = "lucky";
		// give the player some extra cash
		life.current.finance.cash += life.listings.vendors["storage"].stock[0].price;
		oldLife = JSON.parse(JSON.stringify(life));
		vendorObj = {};
		transaction = {
			id: "testing",
			type: "buy",
			index: 0
		};
		newLife = vendors.doVendorTransaction("storage", oldLife, transaction);
	});

	it(`storage vendor increase all storage`, (done) => {
		const newAvailable = oldLife.current.storage.available + config.GAME.vendors.storage.units;
		const newTotal = oldLife.current.storage.total + config.GAME.vendors.storage.units;
		// available storage
		expect(newLife.current.storage.available).to.equal(newAvailable);
		expect(common.isWholeNumber(newLife.current.storage.available)).to.be.true;
		// total storage
		expect(newLife.current.storage.total).to.equal(newTotal);
		expect(common.isWholeNumber(newLife.current.storage.total)).to.be.true;
		return done();
	});

	it(`storage vendor decrease cash`, (done) => {
		const newCash = oldLife.current.finance.cash - oldLife.listings.vendors["storage"].stock[0].price;
		// cash on hand
		expect(newLife.current.finance.cash).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
		return done();
	});

	it(`storage vendor stock should remove sold item`, (done) => {
		const newStock = oldLife.listings.vendors["storage"].stock;
		// take one off the top
		newStock.shift();
		let i = 0;
		while (i < newLife.listings.vendors["storage"].stock.length) {
			expect(newLife.listings.vendors["storage"].stock[i].units).to.equal(newStock[i].units);
			expect(newLife.listings.vendors["storage"].stock[i].price).to.equal(newStock[i].price);
			expect(newLife.listings.vendors["storage"].stock[i].name).to.equal(newStock[i].name);
			expect(newLife.listings.vendors["storage"].stock[i].meta).to.equal(newStock[i].meta);
			i++;
		}
		return done();
	});

});
