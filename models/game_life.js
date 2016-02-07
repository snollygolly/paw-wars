"use strict";

const config = require("../config.json");
const game = require("../game.json");
const common = require("../helpers/common");
const r = require("rethinkdb");

const market = require("./game/market");
const airport = require("./game/airport");
const bank = require("./game/bank");
const events = require("./game/events");
const hotel = require("./game/hotel");
const police = require("./game/police");

let connection;

function* createConnection() {
	try {
		// Open a connection and wait for r.connect(...) to be resolve
		connection = yield r.connect(config.site.db);
	}catch (err) {
		console.error(err);
	}
}

module.exports.createLife = function* createLife(player, parameters) {
	// set up the connection
	yield createConnection();
	// create the life object
	const life = module.exports.generateLife(player, parameters);
	const result = yield r.table("lives").insert(life, {returnChanges: true}).run(connection);
	connection.close();
	// console.log("* createLife:", result.changes[0].new_val);
	return result.changes[0].new_val;
};

module.exports.getLife = function* getLife(id) {
	// set up the connection
	yield createConnection();
	// check to see if the document exists
	const result = yield r.table("lives").get(id).run(connection);
	if (result === null) {
		throw new Error("Life document not found / lifeModel.getLife");
	}
	connection.close();
	// console.log("* getLife:", result);
	return result;
};

module.exports.replaceLife = function* replaceLife(life) {
	// set up the connection
	yield createConnection();
	// validate
	const valid = validateLife(life);
	// if this player object isn't valid...
	if (valid.status === false) {
		// ...return the error object
		throw new Error("Life object invalid / lifeModel.replaceLife");
	}
	const result = yield r.table("lives").get(life.id).replace(life, {returnChanges: true}).run(connection);
	connection.close();
	// console.log("* replaceLife:", result.changes[0].new_val);
	return result.changes[0].new_val;
};

module.exports.changeTurn = function changeTurn(life, turns) {
	life.listings.market = market.generateMarketListings(life);
	life.listings.airport = airport.generateAirportListings(life);
	life = bank.handleInterest(life, turns);
	life = hotel.doHotelCheckOut(life);
	life = police.doSimulateEncounter(life);
	life = events.doSimulateEvents(life);
	life.current.turn += turns;
	return life;
};

module.exports.triggerDeath = function triggerDeath(life) {
	// TODO: some death related stuff happens here
	life.alive = false;
	return life;
};

// market
module.exports.saveMarketTransaction = market.saveMarketTransaction;
module.exports.generateMarketListings = market.generateMarketListings;

// airport
module.exports.saveAirportFly = airport.saveAirportFly;
module.exports.generateAirportListings = airport.generateAirportListings;

// bank
module.exports.saveBankTransaction = bank.saveBankTransaction;
module.exports.saveBankLending = bank.saveBankLending;
module.exports.generateBankListings = bank.generateBankListings;

// hotel
module.exports.saveHotelCheckIn = hotel.saveHotelCheckIn;

// police
module.exports.doSimulateEncounter = police.doSimulateEncounter;
module.exports.startEncounter = police.startEncounter;
module.exports.saveEncounter = police.saveEncounter;
module.exports.simulateEncounter = police.simulateEncounter;

module.exports.generateLife = function generateLife(player, parameters) {
	const life = {
		id: `${player.id}_${Date.now()}`,
		alive: true,
		starting: {
			turn: 1,
			event: game.events.starting_message,
			police: {
				heat: game.police.starting_heat,
				rate: game.police.heat_rate,
				awareness: {},
				encounter: null,
				history: []
			},
			hotel: true,
			location: {
				id: parameters.location.id,
				city: parameters.location.city,
				country: parameters.location.country,
				continent: parameters.location.continent,
				size: parameters.location.size
			},
			health: {
				points: 100,
				status: null
			},
			finance: {
				cash: game.bank.starting_cash,
				savings: game.bank.starting_savings,
				debt: game.bank.starting_debt,
				debt_interest: game.bank.debt_interest,
				savings_interest: game.bank.savings_interest
			},
			inventory: [],
			storage: {
				available: game.market.starting_storage,
				total: game.market.starting_storage
			}
		},
		current: {},
		listings: {
			market: [],
			airport: []
		},
		actions: []
	};
	// adjust the police awareness for the current location here, for the linter
	life.starting.police.awareness[parameters.location.country] = game.police.starting_heat;
	// we just created life.	let that dwell on you for a little bit.
	// this is where it all starts.
	life.current = life.starting;
	// simulate the prices here
	life.listings.market = market.generateMarketListings(life);
	life.listings.airport = airport.generateAirportListings(life);
	return life;
};

function validateLife(life) {
	if (!life.id) {return {status: false, reason: "No ID"};}
	if (!life.current) {return {status: false, reason: "No Current Object"};}
	return {status: true};
}
