"use strict";

const config = require('../config.json');
const playerModel = require('../models/game_player');

let user = null;

module.exports.account = function* account(){
	if (this.isAuthenticated()) {
	  user = this.session.passport.user;
	}else{
		return this.redirect('/');
	}
	yield this.render('account', {title: config.site.name, user: JSON.stringify(user, null, 2)});
}

module.exports.db = function* db(){
	let player = {
		id: "4993074",
		username: "snollygolly"
	};
	let result = yield playerModel.checkPlayer(player);
	console.log(result);
	yield this.render('account', {title: config.site.name, result: result.username});
}
