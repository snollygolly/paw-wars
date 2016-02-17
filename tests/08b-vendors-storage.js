"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const vendors = main.vendors;

const vendor = "storage";
let life;
let vendorObj;

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
