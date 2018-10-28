"use strict";

const config = require("../config.json");
const game = require("../game.json");
const placesJSON = require("../models/game/data/places.json");
const deathsJSON = require("../models/game/data/deaths.json");
const lifeModel = require("../models/game_life");

let player = null;
let life = null;

module.exports.play = async(ctx) => {
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = ctx.session.life;
	// TODO: check if the user has a game in progress eventually
	if (life) {
		throw new Error("Can't start a new game when one is in progress / lifeController:play");
	}
	await ctx.render("game/life", {
		game: game,
		player: player,
		places: placesJSON
	});
};

module.exports.create = async(ctx) => {
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	} else {
		// so this passes, remove for later
		player = {};
		player.id = "99999";
	}
	life = ctx.session.life;
	if (life) {
		throw new Error("Can't start a new game when one is in progress / lifeController:create");
	}
	// handle location parsing
	const location = getLocationObj(ctx.request.body.location);
	// TODO: don't create a new life if this player already has one
	life = await lifeModel.createLife(player, {location: location});
	ctx.session.life = life;
	return ctx.redirect("/game/hotel");
};

module.exports.end = async(ctx) => {
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = ctx.session.life;
	if (!life) {
		throw new Error("Can't end a life without a life / lifeController:end");
	}
	// check to see if they don't have a eulogy
	if (!life.eulogy) {
		life.eulogy = deathsJSON.stopped;
	}
	life.score = lifeModel.getScore(life);
	delete ctx.session.life;
	await ctx.render("game/game_over", {
		title: config.site.name,
		player: player,
		past_life: life
	});
};

module.exports.get = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	// 99999_1455077179080 for example
	const validIDRegex = /^\d+_\d+$/gm;
	const parameters = ctx.request.query;
	if (!parameters) {
		throw new Error("Missing parameter object");
	}
	if (!parameters.id) {
		throw new Error("Missing parameters");
	}
	const validID = validIDRegex.test(parameters.id);
	if (validID !== true) {
		throw new Error("Bad parameters");
	}
	// we've passed checks at this point
	life = await lifeModel.getLife(parameters.id);
	if (life.error) {
		// something went wrong during the process
		throw new Error(life.message);
	}
	ctx.body = { life };
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
