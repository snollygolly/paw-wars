"use strict";

const config = require('../config.json');
const playerModel = require('../models/game_player');

let player = null;
let life = null;

module.exports.index = function* index(){
	if (this.isAuthenticated()) {
	  player = this.session.passport.user;
	}
	life = this.session.life;
	yield this.render('index', {
		title: config.site.name,
		player: player,
		life: life
	});
}

module.exports.account = function* account(){
	if (this.isAuthenticated()) {
	  player = this.session.passport.user;
	}
	life = this.session.life;
	yield this.render('account', {
		title: config.site.name,
		player: player,
		life: life
	});
}
