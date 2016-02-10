"use strict";

const game = require("../../game.json");
const itemsJSON = require("./data/items.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");

module.exports.saveMarketTransaction = function* saveMarketTransaction(id, transaction) {
	// get the latest copy from the database
	let life = yield model.getLife(id);
	// run all the transaction logic against it and get it back
	life = module.exports.doMarketTransaction(life, transaction);
	// check for errors
	if (life.error === true) {
		// exit early
		return life;
	}
	// now replace it in the DB
	life = yield model.replaceLife(life);
	return life;
};

module.exports.doMarketTransaction = function doMarketTransaction(life, transaction) {
	const newLife = JSON.parse(JSON.stringify(life));
	// start to error check the transactions
	// first, see what they want to do, and see if the units are available
	const listing = common.getObjFromID(transaction.item, newLife.listings.market);
	let inventory = common.getObjFromID(transaction.item, newLife.current.inventory);
	// figure out the total price
	const totalPrice = transaction.units * listing.price;
	if (inventory === false) {
		// we searched the inventory for this object, but didn't find it, lets make it
		inventory = {
			id: listing.id,
			units: 0
		};
		newLife.current.inventory.push(inventory);
	}
	if (transaction.type == "buy") {
		if (transaction.units > listing.units) {
			// they want more than we have
			return {error: true, message: "Transaction buys more units than available"};
		}
		if (transaction.units > newLife.current.storage.available) {
			// they want more than we have
			return {error: true, message: "Transaction buys more units than storage can hold"};
		}
		// check their money (keep in mind, savings doesn't count. dealers don't take checks)
		if (totalPrice > newLife.current.finance.cash) {
			return {error: true, message: "Transaction requests more units than life can afford"};
		}
		// adjust the user's money
		newLife.current.finance.cash -= totalPrice;
		// adjust the listing's stock
		listing.units -= transaction.units;
		// adjust the storage
		newLife.current.storage.available -= transaction.units;
		// adjust the inventory stock
		inventory.units += transaction.units;
	} else if (transaction.type == "sell") {
		const inventory = common.getObjFromID(transaction.item, newLife.current.inventory);
		if (transaction.units > inventory.units) {
			return {error: true, message: "Transaction sells more units than available"};
		}
		// adjust the user's money
		newLife.current.finance.cash += totalPrice;
		// adjust the listing's stock
		listing.units += transaction.units;
		// adjust the storage
		newLife.current.storage.available += transaction.units;
		// adjust the inventory stock
		inventory.units -= transaction.units;
	}
	// save it back to the array
	newLife.listings.market = common.replaceObjFromArr(listing, newLife.listings.market);
	newLife.current.inventory = common.replaceObjFromArr(inventory, newLife.current.inventory);
	// add heat for this transaction
	if (!newLife.current.police.awareness[newLife.current.location.country]) {
		newLife.current.police.awareness[newLife.current.location.country] = 0;
	}
	newLife.current.police.awareness[newLife.current.location.country] += game.police.heat_rate;
	newLife.actions.push({
		turn: life.current.turn,
		type: "market",
		data: transaction
	});
	// console.log("* doMarketTransaction:", life);
	return newLife;
};

module.exports.generateMarketListings = function generateMarketListings(life, turnsSpent) {
	// generates the prices and units for the market
	const priceArr = [];
	// set the listing multiplier to show how many listings
	const multi = 1 - (life.current.location.size * game.market.size_affect) / game.market.size_max;
	const listingMulti = (life.current.location.size * game.market.size_affect) / game.market.size_max;
	const listingLength = Math.ceil(listingMulti * itemsJSON.length);
	// To help improve balance a bit, the more turns are spent in one setting, the
	// more likely you are to come across items you already have in your inventory
	let paddingJSON = [];
	let index = 0;
	if (life.current.inventory.length > 0) {
		while (index < turnsSpent) {
			for (const item of life.current.inventory) {
				for (const itemJSON of itemsJSON) {
					if (item.id === itemJSON.id) {
						// Exit out of this inner loop, since we got what we wanted,
						// and push the dupe to the array.
						paddingJSON.push(itemJSON);
						index++;
						break;
					}
				}
			}
		}
	}

	paddingJSON = paddingJSON.concat(itemsJSON);
	// remove random amounts off the padded JSON.
	let prunedItemsJSON = common.randomShrinkArr(paddingJSON, listingLength);
	// Now we need to remove duplicates and compare to ensure enough items made it
	// on the list.
	const itemsExisting = {};
	prunedItemsJSON = prunedItemsJSON.filter(function filterItems(item) {
		// Don't like ternaries, but they work well in filter functions.
		return itemsExisting.hasOwnProperty(item.id) ? false : (itemsExisting[item.id] = true);
	});
	// If there aren't enough items in the array, we need to grab from the item
	// list, filtered to not have any of the existing items in them. It's...
	// exhausting.
	if (prunedItemsJSON.length < listingLength) {
		let filteredItemsJSON = itemsJSON.filter(function filterItems(item) {
			return !prunedItemsJSON.some(function someItems(prunedItem) {
				return prunedItem.id === item.id;
			});
		});
		filteredItemsJSON = common.randomShrinkArr(filteredItemsJSON, listingLength - prunedItemsJSON.length);
		prunedItemsJSON = prunedItemsJSON.concat(filteredItemsJSON);
	}

	// generate price min/max
	const priceMin = multi * game.market.price_variance.min;
	const priceMax = multi * game.market.price_variance.max;
	// generate unit min/max
	const unitMin = multi * game.market.unit_variance.min;
	const unitMax = multi * game.market.unit_variance.max;
	// loop through each items to set prices and qty
	for (const item of prunedItemsJSON) {
		const priceObj = {
			id: item.id,
			name: item.name,
			description: item.description,
			rarity: item.rarity
		};
		// get the mod percentage we're going to use to indicate price and qty available
		const modPerc = item.rarity / 100;
		// generate some random numbers for price and qty
		// TODO: handle variations in price here, they may follow trends?
		// generate price variance
		const priceVariance = common.getRandomArbitrary(priceMin, priceMax);
		const modBasePrice = (game.market.base_price * priceVariance) + game.market.base_price;
		// generate unit variance
		const unitVariance = common.getRandomArbitrary(unitMin, unitMax);
		const modBaseUnits = (game.market.base_units * unitVariance) + game.market.base_units;
		// calculate and set price
		const price = Math.round(modPerc * modBasePrice);
		priceObj.price = price;
		// calculate and set total units available
		const units = Math.round((1 - modPerc) * modBaseUnits);
		priceObj.units = units;
		// push to array
		priceArr.push(priceObj);
	}
	return priceArr;
};
