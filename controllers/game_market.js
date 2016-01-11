"use strict";

const config = require('../config.json');
const items = require('../models/items.json');

const common = require('../helpers/common');

let player = null;
let life = null;

module.exports.index = function* index(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	try{life = this.session.life;}catch(e){}
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
	console.log(life);
	yield this.render('game_market', {
		title: config.site.name,
		player: player,
		life: life,
		items: items,
		script: "game_market"
	});
}
