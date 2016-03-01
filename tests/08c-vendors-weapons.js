"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const vendors = main.vendors;

const vendor = "weapons";
let life;
let oldLife;
let newLife;
let vendorObj;
let transaction;

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
			expect(stock.units).to.equal(config.GAME.vendors[vendor].units);
		}
		return done();
	});

	it("weapons stock should be priced correctly", (done) => {
		const basePrice = config.GAME.vendors.base_price * config.GAME.vendors[vendor].pricing.times_base;
		const increaseRate = config.GAME.vendors[vendor].pricing.increase_rate;
		let lastPrice = basePrice;
		for (const stock of vendorObj.stock) {
			expect(stock.price).to.equal(lastPrice * increaseRate);
			expect(common.isWholeNumber(stock.price)).to.be.true;
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

describe("Vendors [Weapons] - Handle Transaction", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.current.vendor_meta = "lucky";
		// generate listings to fill stock of closed vendors
		life.listings.vendors[vendor] = vendors.generateVendorListings(vendor, life);
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

	it(`weapons vendor should give new weapon`, (done) => {
		const newWeapon = oldLife.listings.vendors[vendor].stock[0];
		expect(newLife.current.weapon.name).to.equal(newWeapon.name);
		expect(newLife.current.weapon.damage).to.equal(newWeapon.meta.value);
		return done();
	});

	it(`weapons vendor should decrease cash`, (done) => {
		const newCash = oldLife.current.finance.cash - oldLife.listings.vendors[vendor].stock[0].price;
		// cash on hand
		expect(newLife.current.finance.cash).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
		return done();
	});

	it(`weapons vendor stock should remove sold item`, (done) => {
		const newStock = oldLife.listings.vendors[vendor].stock;
		// take one off the top
		newStock.shift();
		let i = 0;
		while (i < newLife.listings.vendors[vendor].stock.length) {
			expect(newLife.listings.vendors[vendor].stock[i].units).to.equal(newStock[i].units);
			expect(newLife.listings.vendors[vendor].stock[i].price).to.equal(newStock[i].price);
			expect(newLife.listings.vendors[vendor].stock[i].name).to.equal(newStock[i].name);
			expect(newLife.listings.vendors[vendor].stock[i].meta.value).to.equal(newStock[i].meta.value);
			i++;
		}
		return done();
	});

});
