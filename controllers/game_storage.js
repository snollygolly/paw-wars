"use strict";

const config = require("../helpers/config");
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
		life: life,
		scripts:["game_storage"]
	});
};
