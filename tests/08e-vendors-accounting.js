"use strict";

const expect = require("chai").expect;
const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const vendors = main.vendors;

const vendor = "accounting";
let life;
let oldLife;
let newLife;
let vendorObj;
let transaction;

describe("Vendors [accounting] - Handle Transaction", () => {
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

	it("accounting vendor should decrease cash", (done) => {
		const newCash = oldLife.current.finance.cash - oldLife.listings.vendors[vendor].stock[0].price;
		// cash on hand
		expect(newLife.current.finance.cash).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
		return done();
	});

	it("accounting vendor stock should remove sold item", (done) => {
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

	it("accounting vendor should add upgrades", (done) => {
		expect(newLife.current.upgrades).to.exist;
		expect(newLife.current.upgrades.bookkeeping).to.exist;
		expect(newLife.current.upgrades.bookkeeping.enabled).to.equal(true);

		return done();
	});
});
