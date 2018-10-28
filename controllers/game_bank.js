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
		player: player,
		life: life,
		script: "game_bank"
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
		throw new Error("No life found / bankController:transaction");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.body = {error: true, message: "You're dead and can't do things"};
	}
	if (life.current.hotel === false) {
		return ctx.body = {error: true, message: "Must be checked into a hotel first"};
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
		return ctx.body = {error: true, message: "Invalid type passed"};
	}
	// let's start doing some checks
	parameters.amount = parseFloat(parameters.amount);
	// is this a valid amount?
	if (parameters.amount <= 0) {
		return ctx.body = {error: true, message: "Bad unit amount"};
	}
	// is this the right life ID?
	if (life.id != parameters.id) {
		return ctx.body = {error: true, message: "Bad ID"};
	}
	// we've passed checks at this point
	const transaction = {
		id: Date.now(),
		type: parameters.type,
		amount: parameters.amount
	};
	life = await lifeModel.saveBankTransaction(life.id, transaction);
	if (life.error) {
		// something went wrong during the process
		return ctx.body = {error: true, message: life.message};
	}
	// update the session
	ctx.session.life = life;
	ctx.body = {error: false, life: life};
};

module.exports.lending = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / bankController:lending");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.body = {error: true, message: "You're dead and can't do things"};
	}
	if (life.current.hotel === false) {
		return ctx.body = {error: true, message: "Must be checked into a hotel first"};
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
		return ctx.body = {error: true, message: "Invalid type passed"};
	}
	// let's start doing some checks
	parameters.amount = parseFloat(parameters.amount);
	// is this a valid amount?
	if (parameters.amount <= 0) {
		return ctx.body = {error: true, message: "Bad unit amount"};
	}
	// is this the right life ID?
	if (life.id != parameters.id) {
		return ctx.body = {error: "Bad ID"};
	}
	// we've passed checks at this point
	const transaction = {
		id: Date.now(),
		type: parameters.type,
		amount: parameters.amount
	};
	life = await lifeModel.saveBankLending(life.id, transaction);
	if (life.error) {
		// something went wrong during the process
		return ctx.body = {error: true, message: life.message};
	}
	// update the session
	ctx.session.life = life;
	ctx.body = {error: false, life: life};
};
