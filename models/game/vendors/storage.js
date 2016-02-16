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

module.exports.generateVendorListings = function generateVendorListings(life) {
	// generates the prices and units for the vendor
	const listingObj = {
		open: true,
		stock: fillStock(life)
	};

	return listingObj;
};

function fillStock(lifeObj) {
	const stockArr = [];
	// make some shorthand versions of props
	const basePrice = game.vendors.base_price * game.vendors.storage.pricing.times_base;
	const increaseRate = game.vendors.storage.pricing.increase_rate;
	// TODO: add code to increase the base price as we aquire more storage
	let lastPrice = basePrice;
	let i = 0;
	// add one item for stock count
	while (i < game.vendors.storage.stock) {
		const stockObj = {
			units: 10,
			name: "units of storage",
			price: (lastPrice * increaseRate),
			meta: null
		};
		lastPrice = stockObj.price;
		stockArr.push(stockObj);
		i++;
	}
	return stockArr;
}
