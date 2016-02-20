"use strict";

const config = require("../config.json");
const game = require("../game.json");
const lifeModel = require("../models/game_life");

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
		throw new Error("No life found / vendorsController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return this.redirect("/game/over");
	}
	// save the life back to the session
	this.session.life = life;
	yield this.render("game/vendors", {
		player: player,
		life: life,
		script: "game_vendors"
	});
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
		throw new Error("No life found / vendorsController:transaction");
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
	if (!parameters.id || !parameters.type || !parameters.index) {
		return this.body = {error: true, message: "Missing parameters"};
	}
	if (life.id != parameters.id) {
		return this.body = {error: "Bad ID"};
	}
	// maybe sell comes later, for now, it's only buy
	if (parameters.type != "buy") {
		return this.body = {error: true, message: "Bad transaction type"};
	}
	parameters.index = parseInt(parameters.index);
	if (Number.isInteger(parameters.index) === false || parameters.index < 0) {
		return this.body = {error: true, message: "Bad index"};
	}
	// if this vendor isn't in the array of enabled vendors, reject
	if (game.vendors.enabled.indexOf(parameters.vendor) <= -1) {
		return this.body = {error: true, message: "Bad vendor"};
	}
	// we've passed checks at this point
	const transaction = {
		id: Date.now(),
		type: parameters.type,
		index: parameters.index,
		vendor: parameters.vendor
	};
	life = yield lifeModel.saveVendorTransaction(life.id, transaction);
	if (life.error) {
		// something went wrong during the process
		return this.body = {error: true, message: life.message};
	}
	// update the session
	this.session.life = life;
	this.body = {error: false, life: life};
};
