"use strict";

const config = require("../config.json");
const playerModel = require("../models/game_player");

let player = null;
let life = null;

module.exports.index = async(ctx) => {
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	life = ctx.session.life;
	await ctx.render("index", {
		player: player,
		life: life
	});
};

module.exports.account = async(ctx) => {
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	life = ctx.session.life;
	await ctx.render("account", {
		player: player,
		life: life
	});
};
