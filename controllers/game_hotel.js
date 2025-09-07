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
		life = await lifeModel.saveHotelCheckIn(life._id);
		police = false;
	}
	// save the life back to the session
	ctx.session.life = life;
	await ctx.render("game/hotel", {
		layout: "game",
		player: player,
		life: life,
		police: police
	});
};
