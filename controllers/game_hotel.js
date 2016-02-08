"use strict";

const config = require("../config.json");
const lifeModel = require("../models/game_life");

const common = require("../helpers/common");

let player = null;
let life = null;

module.exports.index = function* index() {
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life) {
		throw new Error("No life found / hotelController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		throw new Error("You're dead and can't do things / hotelController:index");
	}
	let police;
	if (life.current.police.encounter !== null) {
		// there's an active police encounter, alert them
		police = true;
	} else {
		// check the user in
		life = yield lifeModel.saveHotelCheckIn(life.id);
		police = false;
	}
	// save the life back to the session
	this.session.life = life;
	yield this.render("game_hotel", {
		title: config.site.name,
		player: player,
		life: life,
		police: police
	});
};
