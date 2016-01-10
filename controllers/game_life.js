"use strict";

const config = require('../config.json');
const places = require('../models/places.json');
const lifeModel = require('../models/game_life');

let player = null;

module.exports.play = function* play(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	yield this.render('play', {
		config: config,
		title: config.site.name,
		player: (player === null) ? null : player,
		places: places
	});
}

module.exports.create = function* create(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}else{
		// so this passes, remove for later
		player = {};
		player.id = "99999";
	}
	// add passing location in here later
	let life = yield lifeModel.createLife(player, {})
	this.body = JSON.stringify(life);
}
