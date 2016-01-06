"use strict";

const config = require('../config.json');
const items = require('../models/items.json');

const common = require('../helpers/common');

module.exports.index = function* index(){
	// TODO: add passport stuff back in here
	for (let item of items){
		// loop through each items to set prices and qty
		// TODO: handle events in here, they may affect qty and price
		// TODO: handle variations in price here, they may follow trends?
		let modBasePrice = (config.game.base_price * common.getRandomArbitrary(-0.10, 0.15)) + config.game.base_price;
		let price = Math.round(((item.price / 100) * modBasePrice) * 100) / 100;
		console.log(`Item: ${item.name} - modBasePrice: ${modBasePrice} - Price: ${price}`);

		item.sell_price = price;
	}
	yield this.render('game_market', {title: config.site.name, items: items});
}
