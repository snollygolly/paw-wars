"use strict";

const game = require("../../game.json");
const placesJSON = require("./data/places.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");

module.exports.saveAirportFly = async(id, flight) => {
	// get the latest copy from the database
	let life = await model.getLife(id);
	// run all the transaction logic against it and get it back
	life = module.exports.doAirportFly(life, flight);
	// check for errors
	if (life.error === true) {
		// exit early
		return life;
	}
	// now replace it in the DB
	life = await model.replaceLife(life);
	return life;
};

module.exports.doAirportFly = function doAirportFly(life, flight) {
	let newLife = JSON.parse(JSON.stringify(life));
	// start to error check the transactions
	// first, see what they want to do, and see if the units are available
	const listing = common.getObjFromID(flight.destination, newLife.listings.airport);
	const location = common.getObjFromID(flight.destination, placesJSON);
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
	newLife = model.changeTurn(newLife, listing.flight_time);
	// common.log("debug", "* doAirportFly:", newLife);
	return newLife;
};

module.exports.generateAirportListings = function generateAirportListings(life) {
	// generates prices for the airport
	// loop through each items to set prices and qty
	const priceArr = [];
	const location = life.current.location;
	const listingMulti = (life.current.location.size * game.market.size_affect) / game.market.size_max;
	const listingLength = Math.ceil(listingMulti * placesJSON.length);
	// remove random amounts
	const prunedPlacesJSON = generatePrunedPlaces(placesJSON, location.country, listingLength);
	for (const place of prunedPlacesJSON) {
		const priceObj = {
			id: place.id,
			size: place.size,
			name: place.name,
			city: place.city,
			country: place.country,
			continent: place.continent
		};
		priceObj.flight_number = generateFlightNumber();
		// generate price for flights
		// TODO: factor in continents into pricing and probably travel time
		// generate a multiplier for how much size affects price
		const multi = 1 - (place.size * game.market.size_affect) / game.market.size_max;
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
		if (game.airport.flat_flight === true) {
			// they want flat flight times (classic paw wars)
			return 1;
		}
		Number.prototype.toRadians = function toRadians() {
			return this * Math.PI / 180;
		};

		// Utilize the Haversine formula to calculate the shortest distance over the
		// earth's surface.
		const R = 6371000;
		const radiansLat1 = current.coordinates.latitude.toRadians();
		const radiansLat2 = future.coordinates.latitude.toRadians();
		const deltaLat = (future.coordinates.latitude - current.coordinates.latitude).toRadians();
		const deltaLon = (future.coordinates.longitude - current.coordinates.longitude).toRadians();

		const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(radiansLat1) * Math.cos(radiansLat2) *
			Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		// Now we have the distance!
		const distance = R * c;

		// Now that we have the distance, I utilize a shabby guess to calculate time
		// to get there. In meters
		const planeSpeedInMetersPerHour = game.airport.plane_speed_m_per_h;
		const hours = distance / planeSpeedInMetersPerHour;
		const turnsPerHour = game.airport.turns_per_hour;

		return Math.ceil(hours * turnsPerHour);
	}

	function generatePrunedPlaces(places, country, size) {
		const shuffledArr = common.shuffleArr(places);
		const returnArr = [];
		let currentSize = 0;
		for (const place of shuffledArr) {
			if (place.country === country) {
				returnArr.push(place);
				continue;
			}
			if (currentSize < size) {
				returnArr.push(place);
				currentSize++;
			}
		}
		return returnArr;
	}
};
