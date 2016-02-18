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
	let newLife = JSON.parse(JSON.stringify(life));
	// start to error check the transactions
	const stock = newLife.listings.vendors[vendor].stock;
	// check to make sure the transaction looks right
	// are they open?
	if (newLife.listings.vendors[vendor].open === false) {
		return {error: true, message: "This vendor isn't open"};
	}
	// does this transaction index exist in the listing?
	if (transaction.index >= stock.length) {
		return {error: true, message: "Transaction requests item that doesn't exist"};
	}
	// check their money (keep in mind, savings doesn't count. dealers don't take checks)
	if (stock[transaction.index].price > newLife.current.finance.cash) {
		return {error: true, message: "Transaction requests more units than life can afford"};
	}
	newLife = vendors[vendor].doVendorTransaction(newLife, transaction);
	newLife.actions.push({
		turn: life.current.turn,
		type: "vendor",
		data: transaction
	});
	// console.log("* doVendorTransaction:", life);
	return newLife;
};

module.exports.generateVendorListings = function generateVendorListings(vendor, life) {
	const newLife = JSON.parse(JSON.stringify(life));
	// see if we even get an event
	const roll = common.rollDice(0, 1, life.current.vendor_meta);
	// see if our roll is good enough for an event
	if ((game.vendors[vendor].frequency <= roll && game.vendors[vendor].start_open === false) || life.testing === true) {
		// the vendor is closed
		return {
			open: false,
			stock: []
		};
	}
	// generates the prices and units for the vendor
	return vendors[vendor].generateVendorListings(newLife);
};
