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
	life = this.session.life;
	if (!life){
		throw new Error("No life found / marketController:index");
	}
	let i = 0;
	while (i < items.length){
		// loop through items and prices, merge them together
		items[i].price = life.prices.market[i].price;
		items[i].units = life.prices.market[i].units;
		// price_id is for debugging, to make sure values match
		items[i].price_id = life.prices.market[i].id;
		i++;
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

module.exports.transaction = function* transaction(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	// life = this.session.life;
	// if (!life){
	// 	throw new Error("No life found / marketController:transaction");
	// }
	let parameters = this.request.body;
	if (!parameters){
		return this.body = {error: true, message: "Missing parameter object"};
	}
	if (!parameters.id || !parameters.type || !parameters.item || !parameters.units){
		return this.body = {error: true, message: "Missing parameters"};
	}
	// if (life.id != parameters.id){
	// 	return this.body = {error: "Bad ID"};
	// }
	if (parameters.type != "buy" && parameters.type != "sell"){
		return this.body = {error: true, message: "Bad transaction type"};
	}
	if (Number.isInteger(parameters.units) === false){
		return this.body = {error: true, message: "Bad unit amount"};
	}
	// we've passed checks at this point
	let transaction = {
		id: Date.now(),
		type: parameters.type,
		item: parameters.item,
		units: parameters.units
	};
	this.body = {error: false, inventory: {}, debug: this.request.body};
}
