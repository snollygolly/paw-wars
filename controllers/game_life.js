"use strict";

const config = require("../config.json");
const game = require("../game.json");
const placesJSON = require("../models/game/data/places.json");
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
		life: life,
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
	delete this.session.life;
	yield this.render("game/game_over", {
		title: config.site.name,
		player: player,
		past_life: life
	});
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
