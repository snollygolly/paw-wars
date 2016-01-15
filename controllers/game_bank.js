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

module.exports.transaction = function* transaction(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life){
		throw new Error("No life found / bankController:transaction");
	}
	let parameters;
	// figure out which type of transaction they want to be doing here
	if (this.request.body.type == "deposit"){
		// they posted, this means it's a deposit
		parameters = this.request.body;
	}else if (this.request.query.type == "withdraw"){
		// this got, this means it's a get
		parameters = this.request.query;
	}else{
		console.log(this.request.query);
		return this.body = {error: true, message: "Invalid type passed"};
	}
	// let's start doing some checks
	parameters.amount = parseFloat(parameters.amount);
	// is this a valid amount?
	if (parameters.amount <= 0){
		return this.body = {error: true, message: "Bad unit amount"};
	}
	// is this the right life ID?
	if (life.id != parameters.id){
		return this.body = {error: "Bad ID"};
	}
	// we've passed checks at this point
	let transaction = {
		id: Date.now(),
		type: parameters.type,
		amount: parameters.amount
	};
	life = yield lifeModel.doBankTransaction(life.id, transaction);
	if (life.error){
		// something went wrong during the process
		return this.body = {error: true, message: life.message};
	}
	// update the session
	this.session.life = life;
	this.body = {error: false, life: life};
}

module.exports.lending = function* lending(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life){
		throw new Error("No life found / bankController:withdraw");
	}
	let parameters = this.request.body;
	if (!parameters){
		return this.body = {error: true, message: "Missing parameter object"};
	}
	if (!parameters.id || !parameters.type || !parameters.item || !parameters.units){
		return this.body = {error: true, message: "Missing parameters"};
	}
	if (life.id != parameters.id){
		return this.body = {error: "Bad ID"};
	}
	if (parameters.type != "buy" && parameters.type != "sell"){
		return this.body = {error: true, message: "Bad transaction type"};
	}
	parameters.units = parseInt(parameters.units);
	if (Number.isInteger(parameters.units) === false || parameters.units <= 0){
		return this.body = {error: true, message: "Bad unit amount"};
	}
	// we've passed checks at this point
	let transaction = {
		id: Date.now(),
		type: parameters.type,
		item: parameters.item,
		units: parameters.units
	};
	life = yield lifeModel.doMarketTransaction(life.id, transaction);
	if (life.error){
		// something went wrong during the process
		return this.body = {error: true, message: life.message};
	}
	// update the session
	this.session.life = life;
	this.body = {error: false, life: life};
}
