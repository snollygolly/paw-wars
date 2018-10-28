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
		throw new Error("No life found / hotelController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.redirect("/game/over");
	}
	let police;
	if (life.current.police.encounter !== null) {
		// there's an active police encounter, alert them
		police = true;
	} else {
		// check the user in
		life = await lifeModel.saveHotelCheckIn(life.id);
		police = false;
	}
	// save the life back to the session
	ctx.session.life = life;
	await ctx.render("game/hotel", {
		player: player,
		life: life,
		police: police
	});
};
