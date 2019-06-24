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

module.exports.records = async(ctx) => {
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
	await ctx.render("records", {
		scores: scores,
		player: player,
		life: life
	});
};

module.exports.obituary = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	if (!ctx.params.id) {
		throw new Error("Must supply an ID");
	}
	const validIDRegex = /^[a-z]{5,}\|\d+_\d+$/gm;
	const validID = validIDRegex.test(ctx.params.id);
	if (validID !== true) {
		throw new Error("Invalid ID");
	}
	const pastLife = await lifeModel.getLife(ctx.params.id);
	if (pastLife === null) {
		throw new Error("Life doesn't exist");
	}
	const life = ctx.session.life;
	await ctx.render("obituary", {
		pastLife: pastLife,
		player: player,
		life: life
	});
};

module.exports.account = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
	if (player.currentLives.length > 0 && !life) {
		life = await lifeModel.getLife(player.currentLives[0]);
		ctx.session.life = life;
	}
	await ctx.render("account", {
		player: player,
		life: life
	});
};
