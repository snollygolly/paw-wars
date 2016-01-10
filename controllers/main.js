"use strict";

const config = require('../config.json');
const playerModel = require('../models/game_player');

let player = null;

module.exports.account = function* account(){
	if (this.isAuthenticated()) {
	  player = this.session.passport.user;
	}else{
		return this.redirect('/');
	}
	yield this.render('account', {title: config.site.name, player: player});
}
