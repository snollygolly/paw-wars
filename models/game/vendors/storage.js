"use strict";

const game = require("../../../game.json");
const common = require("../../../helpers/common");
const model = require("../../game_life.js");

const vendor = "storage";

const name = "Bobbums";
const introduction = `
	<p>Bobbums, a rotund Scottish Fold sitting atop a series of cardboard boxes, looks up from licking his paws as you enter the shop.</p>
	<p>\"Whatcha want?\"</p>
`;

module.exports.doVendorTransaction = function doVendorTransaction(life, transaction) {
	const newLife = JSON.parse(JSON.stringify(life));
	// remove sold mod from stock
	const newMod = newLife.listings.vendors[vendor].stock.splice(transaction.index, 1)[0];
	// take the money from them
	newLife.current.finance.cash -= newMod.price;
	// increase the player storage (both props)
	newLife.current.storage.available += newMod.units;
	newLife.current.storage.total += newMod.units;
	// console.log("* doVendorTransaction:", life);
	return newLife;
};

module.exports.generateVendorListings = function generateVendorListings(life) {
	// generates the prices and units for the vendor
	const listingObj = {
		open: true,
		name: name,
		introduction: introduction,
		stock: fillStock(life)
	};

	return listingObj;
};

function fillStock(lifeObj) {
	const stockArr = [];
	// make some shorthand versions of props
	const basePrice = game.vendors.base_price * game.vendors[vendor].pricing.times_base;
	const increaseRate = game.vendors[vendor].pricing.increase_rate;
	// TODO: add code to increase the base price as we aquire more storage
	let lastPrice = basePrice;
	let i = 0;
	// add one item for stock count
	while (i < game.vendors[vendor].stock) {
		const stockObj = {
			units: game.vendors[vendor].units,
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
