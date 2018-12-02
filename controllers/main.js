"use strict";

const config = require("../config.json");
const lifeModel = require("../models/game_life");
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

module.exports.highScores = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let page;
	if (ctx.params.page) {
		page = parseInt(ctx.params.page);
		if (page < 0 || page > 9999) {
			throw new Error("Invalid page supplied");
		}
	}
	const scores = await lifeModel.getHighScores(page);
	const life = ctx.session.life;
	await ctx.render("high_scores", {
		scores: scores,
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
