"use strict";

const config = require("../config.json");
const game = require("../game.json");
const placesJSON = require("../models/game/data/places.json");
const deathsJSON = require("../models/game/data/deaths.json");
const lifeModel = require("../models/game_life");

let player = null;
let life = null;

module.exports.play = function* play() {
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	// TODO: check if the user has a game in progress eventually
	if (life) {
		throw new Error("Can't start a new game when one is in progress / lifeController:play");
	}
	yield this.render("game/life", {
		game: game,
		player: player,
		places: placesJSON
	});
};

module.exports.create = function* create() {
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	} else {
		// so this passes, remove for later
		player = {};
		player.id = "99999";
	}
	life = this.session.life;
	if (life) {
		throw new Error("Can't start a new game when one is in progress / lifeController:create");
	}
	// handle location parsing
	const location = getLocationObj(this.request.body.location);
	// TODO: don't create a new life if this player already has one
	life = yield lifeModel.createLife(player, {location: location});
	this.session.life = life;
	return this.redirect("/game/hotel");
};

module.exports.end = function* end() {
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life) {
		throw new Error("Can't end a life without a life / lifeController:end");
	}
	// check to see if they don't have a eulogy
	if (!life.eulogy) {
		life.eulogy = deathsJSON.stopped;
	}
	life.score = lifeModel.getScore(life);
	delete this.session.life;
	yield this.render("game/game_over", {
		title: config.site.name,
		player: player,
		past_life: life
	});
};

module.exports.get = function* get() {
	// for error handling
	this.state.api = true;
	// 99999_1455077179080 for example
	const validIDRegex = /\d+_\d+/g;
	const parameters = this.request.query;
	if (!parameters) {
		return this.body = {error: true, message: "Missing parameter object"};
	}
	if (!parameters.id) {
		return this.body = {error: true, message: "Missing parameters"};
	}
	const validID = validIDRegex.test(parameters.id);
	if (validID !== true) {
		return this.body = {error: true, message: "Bad parameters"};
	}
	// we've passed checks at this point
	life = yield lifeModel.getLife(parameters.id);
	if (life.error) {
		// something went wrong during the process
		return this.body = {error: true, message: life.message};
	}
	this.body = {error: false, life: life};
};

function getLocationObj(id) {
	for (const place of placesJSON) {
		if (place.id === id) {
			// it's a match
			return place;
		}
	}
	throw new Error(`No location found with ID (${id})/ lifeController.getLocationObj`);
	return false;
}
