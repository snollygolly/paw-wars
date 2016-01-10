"use strict";

const config = require('../config.json');
const items = require('../models/items.json');

const common = require('../helpers/common');

module.exports.index = function* index(){
	// TODO: add passport stuff back in here
	// loop through each items to set prices and qty
	for (let item of items){
		// get the mod percentage we're going to use to indicate price and qty available
		let modPerc = item.rarity / 100;
		// TODO: handle events in here, they may affect qty and price
		// generate some random numbers for price and qty
		// TODO: handle variations in price here, they may follow trends?
		let priceVariance = common.getRandomArbitrary(-0.10, 0.15);
		let modBasePrice = (config.game.base_price * priceVariance) + config.game.base_price;

		let unitVariance = common.getRandomArbitrary(-0.10, 0.15);
		let modBaseUnits = (config.game.base_units * unitVariance) + config.game.base_units;

		// calculate and set price
		let price = Math.round((modPerc * modBasePrice) * 100) / 100;
		item.price = price;
		// calculate and set total units available
		let units = Math.round((1 - modPerc) * modBaseUnits);
		item.units = units;
	}
	yield this.render('game_market', {title: config.site.name, items: items, script: "game_market"});
}
