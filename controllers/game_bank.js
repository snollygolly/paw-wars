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
		throw new Error("No life found / bankController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.redirect("/game/over");
	}
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first / bankController:index");
	}
	await ctx.render("game/bank", {
		layout: "game",
		player: player,
		life: life,
		scripts:["game_bank"]
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
		throw new Error("No life found / bankController:transaction");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		throw new Error("You're dead and can't do things");
	}
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first");
	}
	let parameters;
	// figure out which type of transaction they want to be doing here
	if (ctx.request.body.type == "deposit") {
		// they posted, this means it's a deposit
		parameters = ctx.request.body;
	} else if (ctx.request.query.type == "withdraw") {
		// this got, this means it's a get
		parameters = ctx.request.query;
	} else {
		throw new Error("Invalid type passed");
	}
	// let's start doing some checks
	parameters.amount = parseFloat(parameters.amount);
	// is this a valid amount?
	if (parameters.amount <= 0 || isNaN(parameters.amount) === true) {
		throw new Error("Bad unit amount");
	}
	// is this the right life ID?
	if (life._id != parameters.id) {
		throw new Error("Bad ID");
	}
	// we've passed checks at this point
	const transaction = {
		id: Date.now(),
		type: parameters.type,
		amount: parameters.amount
	};
	life = await lifeModel.saveBankTransaction(life._id, transaction);
	if (life.error) {
		// something went wrong during the process
		throw new Error(life.message);
	}
	// update the session
	ctx.session.life = life;
	ctx.body = { life };
};

module.exports.lending = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / bankController:lending");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		throw new Error("You're dead and can't do things");
	}
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first");
	}
	let parameters;
	// figure out which type of transaction they want to be doing here
	if (ctx.request.body.type == "repay") {
		// they posted, this means it's a deposit
		parameters = ctx.request.body;
	} else if (ctx.request.query.type == "borrow") {
		// this got, this means it's a get
		parameters = ctx.request.query;
	} else {
		throw new Error("Invalid type passed");
	}
	// let's start doing some checks
	parameters.amount = parseFloat(parameters.amount);
	// is this a valid amount?
	if (parameters.amount <= 0 || isNaN(parameters.amount) === true) {
		throw new Error("Bad unit amount");
	}
	// is this the right life ID?
	if (life._id != parameters.id) {
		throw new Error("Bad ID");
	}
	// we've passed checks at this point
	const transaction = {
		id: Date.now(),
		type: parameters.type,
		amount: parameters.amount
	};
	life = await lifeModel.saveBankLending(life._id, transaction);
	if (life.error) {
		// something went wrong during the process
		throw new Error(life.message);
	}
	// update the session
	ctx.session.life = life;
	ctx.body = { life };
};
