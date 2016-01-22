"use strict";

const game = require("../../game.json");
const places = require("./places.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");

module.exports.saveAirportFly = function* saveAirportFly(id, flight) {
	// get the latest copy from the database
	let life = yield model.getLife(id);
	// run all the transaction logic against it and get it back
	life = module.exports.doAirportFly(life, flight);
	// check for errors
	if (life.error === true) {
		// exit early
		return life;
	}
	// now replace it in the DB
	life = yield model.replaceLife(life);
	return life;
};

module.exports.doAirportFly = function doAirportFly(life, flight) {
	let newLife = JSON.parse(JSON.stringify(life));
	// start to error check the transactions
	// first, see what they want to do, and see if the units are available
	const listing = common.getObjFromID(flight.destination, newLife.listings.airport);
	const location = common.getObjFromID(flight.destination, places);
	if (listing === false) {
		// they choose a bad destination
		return {error: true, message: "Flight to invalid destination"};
	}
	// figure out the total price
	const totalPrice = listing.price;
	// check their money (keep in mind, savings doesn't count. dealers don't take checks)
	if (totalPrice > newLife.current.finance.cash) {
		return {error: true, message: "Flight costs more than life can afford"};
	}
	// adjust the user's money
	newLife.current.finance.cash -= totalPrice;
	// adjust their location
	newLife.current.location = location;
	// check them out of their last hotel
	newLife.current.hotel = false;
	// build the life action
	newLife.actions.push({
		turn: newLife.current.turn,
		type: "airport",
		data: listing
	});
	// adjust the turn
	newLife.current.turn += listing.flight_time;
	newLife = model.changeTurn(newLife, newLife.current.turn);
	// console.log("* doAirportFly:", newLife);
	return newLife;
};

module.exports.generateAirportListings = function generateAirportListings(life) {
	// generates prices for the airport
	// loop through each items to set prices and qty
	const priceArr = [];
	const location = life.current.location;
	for (const place of places) {
		const priceObj = {
			id: place.id,
			size: place.size
		};
		priceObj.flight_number = generateFlightNumber();
		// generate price for flights
		// TODO: factor in continents into pricing and probably travel time
		// generate a multiplier for how much size affects price
		const multi = (1 - (priceObj.size / game.airport.size_max)) * game.airport.size_affect;
		// take whatever the min is, take the abs (we don't want negative numbers), multi the multiplier
		const priceFloor = multi * Math.abs(game.airport.price_variance.min);
		// use this to boost the base price of all price generation (larger size = less price)
		const priceVariance = common.getRandomArbitrary(game.airport.price_variance.min + priceFloor, game.airport.price_variance.max + priceFloor);
		// generate flight time
		priceObj.flight_time = findFlightTime(location, place);
		// generate price
		const basePrice = (game.airport.base_price * priceVariance) + game.airport.base_price;
		priceObj.price = Math.round(basePrice * (priceObj.flight_time + 1));
		priceArr.push(priceObj);
	}
	return priceArr;

	function generateFlightNumber() {
		// generates a believable flight number randomly
		let flightNumber = "";
		const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		// see how long each segment is
		const letterSeg = common.getRandomInt(2,3);
		const numberSeg = common.getRandomInt(3,4);
		for (let i = 0; i < letterSeg; i++) {
			flightNumber += alphabet.charAt(common.getRandomInt(0, alphabet.length));
		}
		for (let i = 0; i < numberSeg; i++) {
			flightNumber += String(common.getRandomInt(0, 9));
		}
		return flightNumber;
	}

	function findFlightTime(current, future) {
		let flightTime = 0;
		if (current.city != future.city) {flightTime++;}
		if (current.country != future.country) {flightTime++;}
		if (current.continent != future.continent) {flightTime++;}
		return flightTime;
	}
};
