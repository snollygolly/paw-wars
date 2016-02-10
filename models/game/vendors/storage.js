"use strict";

const game = require("../../../game.json");
const common = require("../../../helpers/common");
const model = require("../../game_life.js");

module.exports.doVendorTransaction = function doVendorTransaction(vendor, life, transaction) {
	const newLife = JSON.parse(JSON.stringify(life));
	// start to error check the transactions
	// first, see what they want to do, and see if the units are available

	// console.log("* doVendorTransaction:", life);
	return newLife;
};

module.exports.generateVendorListings = function generateVendorListings(vendor, life) {
	// generates the prices and units for the vendor
	const priceArr = [];

	return priceArr;
};
