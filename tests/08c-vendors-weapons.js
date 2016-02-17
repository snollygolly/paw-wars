"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const vendors = main.vendors;

const vendor = "weapons";
let life;
let vendorObj;

describe("Vendors [Weapons] - Generate Stock", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.current.vendor_meta = "lucky";
		vendorObj = vendors.generateVendorListings(vendor, life);
	});

	it("weapons vendor should create listing", (done) => {
		expect(vendorObj).to.be.an("object");
		return done();
	});

	it("weapons stock should have the right number of units", (done) => {
		for (const stock of vendorObj.stock) {
			expect(stock.units).to.equal(config.GAME.vendors.weapons.units);
		}
		return done();
	});

	it("weapons stock should be priced correctly", (done) => {
		const basePrice = config.GAME.vendors.base_price * config.GAME.vendors.weapons.pricing.times_base;
		const increaseRate = config.GAME.vendors.weapons.pricing.increase_rate;
		let lastPrice = basePrice;
		for (const stock of vendorObj.stock) {
			expect(stock.price).to.equal(lastPrice * increaseRate);
			lastPrice = stock.price;
		}
		return done();
	});

	it("weapons stock should have the correct meta information", (done) => {
		let i = 0;
		for (const stock of vendorObj.stock) {
			i++;
			expect(stock.meta.name).to.equal("Weapon Damage");
			expect(stock.meta.value).to.equal(i * config.GAME.police.base_damage);
		}
		return done();
	});
});
