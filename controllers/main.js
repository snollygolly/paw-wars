"use strict";

const config = require('../config.json');
const playerModel = require('../models/game_player');

let player = null;

module.exports.index = function* index(){
	if (this.isAuthenticated()) {
	  player = this.session.passport.user;
	}
	yield this.render('index', {title: config.site.name, player: player});
}

module.exports.account = function* account(){
	if (this.isAuthenticated()) {
	  player = this.session.passport.user;
	}
	yield this.render('account', {title: config.site.name, player: player});
}
