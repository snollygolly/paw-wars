"use strict";

const config = require("../config.json");
const playerModel = require("../models/game_player");

module.exports.index = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	const life = ctx.session.life;
	await ctx.render("index", {
		player: player,
		life: life
	});
};

module.exports.account = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	const life = ctx.session.life;
	await ctx.render("account", {
		player: player,
		life: life
	});
};
