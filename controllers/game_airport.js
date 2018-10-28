"use strict";

const config = require("../config.json");
const placesJSON = require("../models/game/data/places.json");
const lifeModel = require("../models/game_life");

const common = require("../helpers/common");

let player = null;
let life = null;

module.exports.index = async(ctx) => {
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / airportController:index");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.redirect("/game/over");
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
	await ctx.render("game/airport", {
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

module.exports.fly = async(ctx) => {
	// for error handling
	ctx.state.api = true;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / airportController:fly");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		return ctx.body = {error: true, message: "You're dead and can't do things"};
	}
	if (life.current.hotel === false) {
		return ctx.body = {error: true, message: "Must be checked into a hotel first"};
	}
	const parameters = ctx.request.body;
	if (!parameters) {
		return ctx.body = {error: true, message: "Missing parameter object"};
	}
	if (!parameters.id || !parameters.destination) {
		return ctx.body = {error: true, message: "Missing parameters"};
	}
	if (life.id != parameters.id) {
		return ctx.body = {error: true, message: "Bad ID"};
	}
	// TODO: destination verification
	// we've passed checks at this point
	const flight = {
		id: Date.now(),
		destination: parameters.destination
	};
	life = await lifeModel.saveAirportFly(life.id, flight);
	if (life.error) {
		// something went wrong during the process`
		return ctx.body = {error: true, message: life.message};
	}
	// update the session
	ctx.session.life = life;
	ctx.body = {error: false, life: life};
};
