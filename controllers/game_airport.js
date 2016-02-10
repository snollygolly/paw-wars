"use strict";

const config = require("../config.json");
const placesJSON = require("../models/game/data/places.json");
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
		throw new Error("No life found / airportController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return this.redirect("/game/over");
	}
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first / airportController:index");
	}
	const lifeObj = JSON.parse(JSON.stringify(life));
	lifeObj.listings.airport.sort(sortByTurns);
	// remove the home entry
	lifeObj.listings.airport.shift();
	// sort by price
	lifeObj.listings.airport.sort(sortByPrice);
	yield this.render("game/airport", {
		player: (player === null) ? null : player,
		life: lifeObj,
		script: "game_airport"
	});

	function sortByTurns(a, b) {
		return Number(a.flight_time) - Number(b.flight_time);
	}

	function sortByPrice(a, b) {
		return Number(a.price) - Number(b.price);
	}
};

module.exports.fly = function* fly() {
	// for error handling
	this.state.api = true;
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = this.session.life;
	if (!life) {
		throw new Error("No life found / airportController:fly");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return this.body = {error: true, message: "You're dead and can't do things"};
	}
	if (life.current.hotel === false) {
		return this.body = {error: true, message: "Must be checked into a hotel first"};
	}
	const parameters = this.request.body;
	if (!parameters) {
		return this.body = {error: true, message: "Missing parameter object"};
	}
	if (!parameters.id || !parameters.destination) {
		return this.body = {error: true, message: "Missing parameters"};
	}
	if (life.id != parameters.id) {
		return this.body = {error: true, message: "Bad ID"};
	}
	// TODO: destination verification
	// we've passed checks at this point
	const flight = {
		id: Date.now(),
		destination: parameters.destination
	};
	life = yield lifeModel.saveAirportFly(life.id, flight);
	if (life.error) {
		// something went wrong during the process`
		return this.body = {error: true, message: life.message};
	}
	// update the session
	this.session.life = life;
	this.body = {error: false, life: life};
};
