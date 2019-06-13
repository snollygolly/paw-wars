"use strict";

const config = require("../config.json");
const game = require("../game.json");
const common = require("../helpers/common");
const placesJSON = require("../models/game/data/places.json");
const deathsJSON = require("../models/game/data/deaths.json");
const lifeModel = require("../models/game_life");
const playerModel = require("../models/game_player");

module.exports.play = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
	if (player.currentLives.indexOf(ctx.query.id) === -1 && life) {
		// this isn't their life, but they have a life going
		throw new Error("Can't start a new game when one is in progress / lifeController:play");
	}
	if (player && player.currentLives.length > 0) {
		let resumeId = player.currentLives[0];
		// they already have a life in progress
		if (ctx.query.id) {
			// they passed in an ID of a life they want to resume, but it's not theirs
			if (ctx.query.id.indexOf(player._id) === -1) {
				throw new Error("Can't resume a game that isn't yours / lifeController:play");
			}
			resumeId = ctx.query.id;
		}
		life = await lifeModel.getLife(resumeId);
		ctx.session.life = life;
		ctx.redirect("/game/hotel");
	}
	await ctx.render("game/life", {
		layout: "game",
		game: game,
		player: player,
		places: placesJSON
	});
};

module.exports.create = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	} else {
		player = playerModel.convertProfile({
			nickname: "Guest",
			displayName: "Guest",
			id: `generic|${common.getRandomInt(100,999999999)}`,
			guest: true
		});
		ctx.session.passport = {
			user: player
		};
	}
	let life = ctx.session.life;
	if (life) {
		throw new Error("Can't start a new game when one is in progress / lifeController:create");
	}
	// don't create a new life if this player already has one
	// TODO: support more than one life at a time?
	if (player.currentLives.length > 0) {
		throw new Error("Can't start a new life when one is attached / lifeController:create");
	}
	// handle location parsing
	const location = getLocationObj(ctx.request.body.location);
	life = await lifeModel.createLife(player, {location: location});
	player.currentLives.push(life._id);
	player = await playerModel.replacePlayer(player);
	ctx.session.life = life;
	return ctx.redirect("/game/hotel");
};

module.exports.end = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
	if (!life) {
		throw new Error("Can't end a life without a life / lifeController:end");
	}
	const lifeIndex = player.currentLives.indexOf(life._id);
	if (lifeIndex === -1) {
		throw new Error("Can't end a life when one isn't attached / lifeController:end");
	}
	// check to see if they don't have a eulogy
	if (!life.eulogy) {
		life.eulogy = deathsJSON.stopped;
	}
	life.score = lifeModel.getScore(life);
	life.alive = false;
	life = await lifeModel.replaceLife(life);
	player.currentLives.splice(lifeIndex, 1);
	player.pastLives.push(life._id);
	player = await playerModel.replacePlayer(player);
	delete ctx.session.life;
	await ctx.render("game/game_over", {
		layout: "game",
		title: config.site.name,
		player: player,
		past_life: life
	});
};

module.exports.get = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	// vendor|99999_1455077179080 for example
	const validIDRegex = /^[a-z]{5,}\|\d+_\d+$/gm;
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
	const life = await lifeModel.getLife(parameters.id);
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
