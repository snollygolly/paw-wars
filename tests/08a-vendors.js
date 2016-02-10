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
		expect(vendorObj).to.have.property("storage");
		expect(vendorObj.storage).to.have.property("on");
		expect(vendorObj.storage).to.have.property("stock");
		expect(vendorObj.storage.on).to.be.a("boolean");
		expect(vendorObj.storage.on).to.equal(config.GAME.vendors.storage.always_on);
		expect(vendorObj.storage.stock).to.be.an("array");
		// weapons vendor
		expect(vendorObj).to.have.property("weapons");
		expect(vendorObj.weapons).to.have.property("on");
		expect(vendorObj.weapons).to.have.property("stock");
		expect(vendorObj.weapons.on).to.be.a("boolean");
		expect(vendorObj.weapons.on).to.equal(config.GAME.vendors.weapons.always_on);
		expect(vendorObj.weapons.stock).to.be.an("array");
		return done();
	});
});
