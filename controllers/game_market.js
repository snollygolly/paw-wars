"use strict";

const config = require("../config.json");
const itemsJSON = require("../models/game/data/items.json");
const lifeModel = require("../models/game_life");
const game = require("../game.json");

const common = require("../helpers/common");

let player = null;
let life = null;

module.exports.index = function* index() {
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life) {
		throw new Error("No life found / marketController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		throw new Error("You're dead and can't do things / marketController:index");
	}
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first / marketController:index");
	}
	life.listings.market.sort(sortByPrice);
	yield this.render("game_market", {
		title: config.site.name,
		player: player,
		life: life,
		features: game.features,
		script: "game_market"
	});

	function sortByPrice(a, b) {
		return Number(a.price) - Number(b.price);
	}
};

module.exports.transaction = function* transaction() {
	// for error handling
	this.state.api = true;
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life) {
		throw new Error("No life found / marketController:transaction");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return this.body = {error: true, message: "You're dead and can't do things"};
	}
	if (life.current.hotel === false) {
		return this.body = {error: true, message: "Must be checked into a hotel first"};
	}
	const parameters = this.request.body;
	if (!parameters) {
		return this.body = {error: true, message: "Missing parameter object"};
	}
	if (!parameters.id || !parameters.type || !parameters.item || !parameters.units) {
		return this.body = {error: true, message: "Missing parameters"};
	}
	if (life.id != parameters.id) {
		return this.body = {error: "Bad ID"};
	}
	if (parameters.type != "buy" && parameters.type != "sell") {
		return this.body = {error: true, message: "Bad transaction type"};
	}
	parameters.units = parseInt(parameters.units);
	if (Number.isInteger(parameters.units) === false || parameters.units <= 0) {
		return this.body = {error: true, message: "Bad unit amount"};
	}
	// we've passed checks at this point
	const transaction = {
		id: Date.now(),
		type: parameters.type,
		item: parameters.item,
		units: parameters.units
	};
	life = yield lifeModel.saveMarketTransaction(life.id, transaction);
	if (life.error) {
		// something went wrong during the process
		return this.body = {error: true, message: life.message};
	}
	// update the session
	this.session.life = life;
	this.body = {error: false, life: life};
};
