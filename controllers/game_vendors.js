"use strict";

const config = require("../config.json");
const game = require("../game.json");
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
		throw new Error("No life found / vendorsController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.redirect("/game/over");
	}
	// save the life back to the session
	ctx.session.life = life;
	await ctx.render("game/vendors", {
		player: player,
		life: life,
		scripts:["game_vendors"]
	});
};

module.exports.transaction = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / vendorsController:transaction");
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
	if (!parameters.id || !parameters.type || !parameters.index) {
		throw new Error("Missing parameters");
	}
	if (life.id != parameters.id) {
		throw new Error("Bad ID");
	}
	// maybe sell comes later, for now, it's only buy
	if (parameters.type != "buy") {
		throw new Error("Bad transaction type");
	}
	parameters.index = parseInt(parameters.index);
	if (Number.isInteger(parameters.index) === false || parameters.index < 0) {
		throw new Error("Bad index");
	}
	// if this vendor isn't in the array of enabled vendors, reject
	if (game.vendors.enabled.indexOf(parameters.vendor) <= -1) {
		throw new Error("Bad vendor");
	}
	// we've passed checks at this point
	const transaction = {
		id: Date.now(),
		type: parameters.type,
		index: parameters.index,
		vendor: parameters.vendor
	};
	life = await lifeModel.saveVendorTransaction(life.id, transaction);
	if (life.error) {
		// something went wrong during the process
		throw new Error(life.message);
	}
	// update the session
	ctx.session.life = life;
	ctx.body = { life };
};
