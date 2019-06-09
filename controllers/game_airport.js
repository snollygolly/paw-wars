"use strict";

const config = require("../config.json");
const placesJSON = require("../models/game/data/places.json");
const lifeModel = require("../models/game_life");

const common = require("../helpers/common");

module.exports.index = async(ctx) => {
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
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
	life.listings.airport.sort(sortByTurns);
	// remove the home entry
	life.listings.airport.shift();
	// sort by price
	life.listings.airport.sort(sortByPrice);
	await ctx.render("game/airport", {
		player: (player === null) ? null : player,
		life,
		scripts:["game_airport"]
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
	let player;
	if (ctx.isAuthenticated()) {
		player = ctx.session.passport.user;
	}
	let life = ctx.session.life;
	if (!life) {
		throw new Error("No life found / airportController:fly");
	}
	life = lifeModel.checkDeath(life);
	if (life.alive === false) {
		throw new Error("You're dead and can't do things");
	}
	if (life.current.hotel === false) {
		throw new Error("Must be checked into a hotel first");
	}
	const parameters = ctx.request.body;
	if (!parameters) {
		throw new Error("Missing parameter object");
	}
	if (!parameters.id || !parameters.destination) {
		throw new Error("Missing parameters");
	}
	if (life._id != parameters.id) {
		throw new Error("Bad ID");
	}
	// TODO: destination verification
	// we've passed checks at this point
	const flight = {
		id: Date.now(),
		destination: parameters.destination
	};
	life = await lifeModel.saveAirportFly(life._id, flight);
	if (life.error) {
		// something went wrong during the process`
		throw new Error(life.message);
	}
	// update the session
	ctx.session.life = life;
	ctx.body = { life };
};
