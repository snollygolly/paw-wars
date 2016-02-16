"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const vendors = main.vendors;

let life;

describe("Vendors - Starting State", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("current vendor state should match config values", (done) => {
		const vendorObj = life.current.vendors;
		let modBasePrice;
		// storage vendor
		expect(vendorObj).to.be.a("object");
		// loop through vendors
		for (const vendor of config.GAME.vendors.enabled) {
			expect(vendorObj).to.have.property(vendor);
			expect(vendorObj[vendor]).to.have.property("open");
			expect(vendorObj[vendor]).to.have.property("stock");
			expect(vendorObj[vendor].open).to.be.a("boolean");
			expect(vendorObj[vendor].open).to.equal(config.GAME.vendors[vendor].always_open);
			expect(vendorObj[vendor].stock).to.be.an("array");
		}
		return done();
	});
});
