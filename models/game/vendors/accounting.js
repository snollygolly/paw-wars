"use strict";

const game = require("../../../game.json");
const common = require("../../../helpers/common");
const model = require("../../game_life.js");
const upgrades = require("../upgrades.js");
const vendors = require("../data/vendors.json");

const vendor = "accounting";

module.exports.doVendorTransaction = function doVendorTransaction(life, transaction) {
	const newLife = JSON.parse(JSON.stringify(life));
	// remove sold mod from stock
	const newMod = newLife.listings.vendors[vendor].stock.splice(transaction.index, 1)[0];
	// take the money from them
	newLife.current.finance.cash -= newMod.price;

	newLife.current.upgrades = upgrades.addUpgrade(newMod.name, newLife.current);

	return newLife;
};

module.exports.generateVendorListings = function generateVendorListings(life) {
	// generates the prices and units for the vendor
	const listingObj = {
		open: true,
		name: vendors[vendor].name,
		introduction: vendors[vendor].introduction,
		stock: fillStock(life)
	};

	return listingObj;
};

function fillStock(lifeObj) {
	const stockArr = [];
	// make some shorthand versions of props
	const basePrice = game.vendors.base_price * game.vendors[vendor].pricing.times_base;
	const increaseRate = game.vendors[vendor].pricing.increase_rate;

	return [
		{
			units: 1,
			name: "Bookkeeping Retainer",
			price: game.vendors.base_price * game.vendors[vendor].pricing.times_base,
			meta: null
		}
	];
}
