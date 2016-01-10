"use strict";

const config = require('../config.json');
const places = require('../models/places.json');

const common = require('../helpers/common');

let player = null;

module.exports.index = function* index(){
	if (this.isAuthenticated()) {
		player = this.session.passport.user;
		// TODO: add an else in here to redirect, but it's too much of pain atm
	}
	// TODO: actually get the current location
	let location = {
		city: "Dallas",
		country: "United States of America",
		continent: "North America"
	}
	// loop through each items to set prices and qty
	for (let place of places){
		place.flight_number = generateFlightNumber();
		// generate price for flights
		// TODO: factor in continents into pricing and probably travel time
		let priceVariance = common.getRandomArbitrary(-0.30, 0.15);
		place.price = (Math.round(((config.game.base_price * priceVariance) + config.game.base_price) * 100) / 100).toFixed(2);
		// generate flight time
		place.flight_time = findFlightTime(location, place)
	}
	yield this.render('game_airport', {
		title: config.site.name,
		player: (player === null) ? null : player,
		places: places,
		script: "game_airport"
	});
}

function generateFlightNumber(){
	// generates a believable flight number randomly
	let flightNumber = '';
	let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	// see how long each segment is
	let letterSeg = common.getRandomInt(2,3);
	let numberSeg = common.getRandomInt(3,4);
	for (let i=0; i < letterSeg; i++){
		flightNumber += alphabet.charAt(common.getRandomInt(0, alphabet.length));
	}
	for (let i=0; i < numberSeg; i++){
		flightNumber += String(common.getRandomInt(0, 9));
	}
	return flightNumber;
}

function findFlightTime(current, future){
	let flightTime = 0;
	if (current.country != future.country){flightTime++;}
	if (current.continent != future.continent){flightTime++;}
	return flightTime;
}
