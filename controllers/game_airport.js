"use strict";

const config = require('../config.json');
const places = require('../models/places.json');

const common = require('../helpers/common');

module.exports.index = function* index(){
	// TODO: add passport stuff back in here
	// loop through each items to set prices and qty
	for (let place of places){
		place.flight_number = generateFlightNumber();
	}
	yield this.render('game_airport', {title: config.site.name, places: places});
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
