"use strict";

const config = require('../config.json');
const places = require('../models/places.json');

const common = require('../helpers/common');

let player = null;

module.exports.hotel = function* hotel(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	yield this.render('game_hotel', {
		title: config.site.name,
		player: (player === null) ? null : player
	});
}
