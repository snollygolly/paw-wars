"use strict";

const config = require("../config.json");
const lifeModel = require("../models/game_life");

const common = require("../helpers/common");

let player = null;
let life = null;

module.exports.index = async(ctx) => {
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = ctx.session.life;
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

	await ctx.render("game/police", {
		player: player,
		life: life,
		script: "game_police"
	});
};

module.exports.encounter = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / policeController:encounter");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.redirect("/game/over");
	}
	if (life.current.police.encounter === null) {
		return ctx.body = {error: true, message: "Must have an encounter started"};
	}
	const parameters = ctx.request.body;
	if (!parameters) {
		return ctx.body = {error: true, message: "Missing parameter object"};
	}
	if (!parameters.id || !parameters.action) {
		return ctx.body = {error: true, message: "Missing parameters"};
	}
	if (life.id != parameters.id) {
		return ctx.body = {error: "Bad ID"};
	}
	// we've passed checks at this point
	// simulate the encounter
	life = await lifeModel.saveEncounter(life.id, parameters.action);
	if (life.error) {
		// something went wrong during the process
		return ctx.body = {error: true, message: life.message};
	}
	if (life.current.police.death === true) {
		// they died :(
		life.alive = false;
	}
	// update the session
	ctx.session.life = life;
	ctx.body = {error: false, life: life};
};
