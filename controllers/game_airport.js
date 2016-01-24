"use strict";

const config = require("../config.json");
const places = require("../models/game/places.json");
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
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first / airportController:index");
	}
	let i = 0;
	while (i < places.length) {
		// loop through items and prices, merge them together
		places[i].flight_number = life.listings.airport[i].flight_number;
		places[i].price = life.listings.airport[i].price;
		places[i].flight_time = life.listings.airport[i].flight_time;
		i++;
	}
	life.listings.airport.sort(sortByTurns);
	places.sort(sortByTurns);
	yield this.render("game_airport", {
		title: config.site.name,
		player: (player === null) ? null : player,
		life: life,
		places: places,
		script: "game_airport"
	});

	function sortByTurns(a, b) {
		return Number(a.flight_time) - Number(b.flight_time);
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
	if (life.current.hotel === false) {
		return this.body = {error: true, message: "Must be checked into a hotel first"};
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
