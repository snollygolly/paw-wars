"use strict";

const config = require("../config.json");
const itemsJSON = require("../models/game/data/items.json");
const lifeModel = require("../models/game_life");
const game = require("../game.json");

const common = require("../helpers/common");

module.exports.index = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / storageController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.redirect("/game/over");
	}
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first / storageController:index");
	}
	await ctx.render("game/storage", {
		layout: "game",
		player: player,
		life: life
	});
};

module.exports.transaction = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / marketController:transaction");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		throw new Error("You're dead and can't do things");
	}
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first");
	}
	const parameters = ctx.request.body;
	if (!parameters) {
		throw new Error("Missing parameter object");
	}
	if (!parameters.id || !parameters.type || !parameters.item || !parameters.units) {
		throw new Error("Missing parameters");
	}
	if (life._id != parameters.id) {
		throw new Error("Bad ID");
	}
	if (parameters.type != "buy" && parameters.type != "sell") {
		throw new Error("Bad transaction type");
	}
	parameters.units = parseInt(parameters.units);
	if (Number.isInteger(parameters.units) === false || parameters.units <= 0) {
		throw new Error("Bad unit amount");
	}
	// we've passed checks at this point
	const transaction = {
		id: Date.now(),
		type: parameters.type,
		item: parameters.item,
		units: parameters.units
	};
	life = await lifeModel.saveMarketTransaction(life._id, transaction);
	if (life.error) {
		// something went wrong during the process
		throw new Error(life.message);
	}
	// update the session
	ctx.session.life = life;
	ctx.body = { life };
};
