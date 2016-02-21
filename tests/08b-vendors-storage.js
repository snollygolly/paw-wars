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
			expect(stock.units).to.equal(config.GAME.vendors[vendor].units);
		}
		return done();
	});

	it("storage stock should be priced correctly", (done) => {
		const basePrice = config.GAME.vendors.base_price * config.GAME.vendors[vendor].pricing.times_base;
		const increaseRate = config.GAME.vendors[vendor].pricing.increase_rate;
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
		life.current.finance.cash += life.listings.vendors[vendor].stock[0].price;
		oldLife = JSON.parse(JSON.stringify(life));
		vendorObj = {};
		transaction = {
			id: "testing",
			type: "buy",
			index: 0,
			vendor: vendor
		};
		newLife = vendors.doVendorTransaction(oldLife, transaction);
	});

	it(`storage vendor should increase all storage`, (done) => {
		const newAvailable = oldLife.current[vendor].available + config.GAME.vendors[vendor].units;
		const newTotal = oldLife.current[vendor].total + config.GAME.vendors[vendor].units;
		// available storage
		expect(newLife.current[vendor].available).to.equal(newAvailable);
		expect(common.isWholeNumber(newLife.current[vendor].available)).to.be.true;
		// total storage
		expect(newLife.current[vendor].total).to.equal(newTotal);
		expect(common.isWholeNumber(newLife.current[vendor].total)).to.be.true;
		return done();
	});

	it(`storage vendor should decrease cash`, (done) => {
		const newCash = oldLife.current.finance.cash - oldLife.listings.vendors[vendor].stock[0].price;
		// cash on hand
		expect(newLife.current.finance.cash).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
		return done();
	});

	it(`storage vendor stock should remove sold item`, (done) => {
		const newStock = oldLife.listings.vendors[vendor].stock;
		// take one off the top
		newStock.shift();
		let i = 0;
		while (i < newLife.listings.vendors[vendor].stock.length) {
			expect(newLife.listings.vendors[vendor].stock[i].units).to.equal(newStock[i].units);
			expect(newLife.listings.vendors[vendor].stock[i].price).to.equal(newStock[i].price);
			expect(newLife.listings.vendors[vendor].stock[i].name).to.equal(newStock[i].name);
			expect(newLife.listings.vendors[vendor].stock[i].meta).to.equal(newStock[i].meta);
			i++;
		}
		return done();
	});

});
