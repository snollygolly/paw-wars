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
	const basePrice = game.vendors.base_price * game.vendors.weapons.pricing.times_base;
	const increaseRate = game.vendors.weapons.pricing.increase_rate;
	// TODO: add code to increase the base price as we aquire more storage
	let lastPrice = basePrice;
	let i = 0;
	// add one item for stock count
	while (i < game.vendors.weapons.stock) {
		const stockObj = {
			units: 1,
			name: makeScaryNamedGuns(),
			price: (lastPrice * increaseRate),
			meta: (i + 1) * game.police.base_damage
		};
		lastPrice = stockObj.price;
		stockArr.push(stockObj);
		i++;
	}
	return stockArr;
}

function makeScaryNamedGuns() {
	const scaryMfgs = [
		"Swat and Hissin",
		"Spots and Stripes",
		"Snuggles Co",
		"Mr. Winkles"
	];
	const scaryModels = [
		"P4W",
		"P4W-S",
		"B1T3",
		"CL4W",
		"5-CR4TCH",
		"H1-55",
		"FLUFF",
		"M30W"
	];
	const scaryCalibers = [
		".22 Short",
		".22 Long",
		"5.7x28mm",
		"9mm",
		".38 Special",
		".357 Magnum",
		".45 ACP",
		".50 Caliber"
	];
	const newMfg = common.getRandomInt(0, scaryMfgs.length - 1);
	const newModel = common.getRandomInt(0, scaryModels.length - 1);
	const newCaliber = common.getRandomInt(0, scaryCalibers.length - 1);
	return `${scaryMfgs[newMfg]} ${scaryModels[newModel]} [${scaryCalibers[newCaliber]}]`;
}
