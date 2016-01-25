"use strict";

const config = require("../config.json");
const places = require("../models/game/data/places.json");
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
	// check the user in
	life = yield lifeModel.saveHotelCheckIn(life.id);
	// save the life back to the session
	this.session.life = life;
	yield this.render("game_hotel", {
		title: config.site.name,
		player: player,
		life: life
	});
};
