"use strict";

const config = require("../helpers/config");
const lifeModel = require("../models/game_life");

const common = require("../helpers/common");

module.exports.index = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
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
		layout: "game",
		player: player,
		life: life,
		scripts:["game_police"]
	});
};

module.exports.encounter = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / policeController:encounter");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.redirect("/game/over");
	}
	if (life.current.police.encounter === null) {
		throw new Error("Must have an encounter started");
	}
	const parameters = ctx.request.body;
	if (!parameters) {
		throw new Error("Missing parameter object");
	}
	if (!parameters.id || !parameters.action) {
		throw new Error("Missing parameters");
	}
	if (life._id != parameters.id) {
		throw new Error("Bad ID");
	}
	// we've passed checks at this point
	// simulate the encounter
	life = await lifeModel.saveEncounter(life._id, parameters.action);
	if (life.error) {
		// something went wrong during the process
		throw new Error(life.message);
	}
	if (life.current.police.death === true) {
		// they died :(
		life.alive = false;
	}
	// update the session
	ctx.session.life = life;
	ctx.body = { life };
};
