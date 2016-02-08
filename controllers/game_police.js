"use strict";

const config = require("../config.json");
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
		throw new Error("No life found / policeController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		throw new Error("You're dead and can't do things / policeController:index");
	}
	if (life.current.police.encounter === null) {
		throw new Error("Must have an encounter started / policeController:index");
	}

	yield this.render("game_police", {
		title: config.site.name,
		player: player,
		life: life,
		script: "game_police"
	});
};

module.exports.encounter = function* encounter() {
	// for error handling
	this.state.api = true;
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life) {
		throw new Error("No life found / policeController:encounter");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return this.body = {error: true, message: "You're dead and can't do things"};
	}
	if (life.current.police.encounter === null) {
		return this.body = {error: true, message: "Must have an encounter started"};
	}
	const parameters = this.request.body;
	if (!parameters) {
		return this.body = {error: true, message: "Missing parameter object"};
	}
	if (!parameters.id || !parameters.action) {
		return this.body = {error: true, message: "Missing parameters"};
	}
	if (life.id != parameters.id) {
		return this.body = {error: "Bad ID"};
	}
	// we've passed checks at this point
	// simulate the encounter
	life = yield lifeModel.saveEncounter(life.id, parameters.action);
	if (life.error) {
		// something went wrong during the process
		return this.body = {error: true, message: life.message};
	}
	if (life.current.police.encounter.reason == "dead") {
		// they died :(
		life.alive = false;
	}
	// update the session
	this.session.life = life;
	this.body = {error: false, life: life};
};
