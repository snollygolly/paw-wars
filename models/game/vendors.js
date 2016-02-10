"use strict";

const game = require("../../game.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");
const vendors = {
	storage: require("./vendors/storage"),
	weapons: require("./vendors/weapons")
};

module.exports.saveVendorTransaction = function* saveVendorTransaction(vendor, id, transaction) {
	// get the latest copy from the database
	let life = yield model.getLife(id);
	// run all the transaction logic against it and get it back
	life = module.exports.doVendorTransaction(life, transaction);
	// check for errors
	if (life.error === true) {
		// exit early
		return life;
	}
	// now replace it in the DB
	life = yield model.replaceLife(life);
	return life;
};

module.exports.doVendorTransaction = function doVendorTransaction(vendor, life, transaction) {
	const newLife = JSON.parse(JSON.stringify(life));
	// start to error check the transactions
	// first, see what they want to do, and see if the units are available

	newLife.actions.push({
		turn: life.current.turn,
		type: "vendor",
		data: transaction
	});
	// console.log("* doVendorTransaction:", life);
	return newLife;
};

module.exports.generateVendorListings = function generateVendorListings(vendor, life) {
	// generates the prices and units for the vendor
	const priceArr = [];

	return priceArr;
};
