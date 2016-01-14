"use strict";

const config = require('../config.json');
const items = require('../models/items.json');
const lifeModel = require('../models/game_life');

const common = require('../helpers/common');

let player = null;
let life = null;

module.exports.index = function* index(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life){
		throw new Error("No life found / bankController:index");
	}
	yield this.render('game_bank', {
		title: config.site.name,
		player: player,
		life: life
	});
}
