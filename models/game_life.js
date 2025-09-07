"use strict";

const config = require("../helpers/config");
const game = require("../game.json");
const common = require("../helpers/common");
const db = require("../helpers/db");

const market = require("./game/market");
const airport = require("./game/airport");
const vendors = require("./game/vendors");
const bank = require("./game/bank");
const events = require("./game/events");
const hotel = require("./game/hotel");
const police = require("./game/police");

const deathsJSON = require("./game/data/deaths.json");
const localization = require("./game/data/localization");

module.exports.createLife = async(player, parameters) => {
	const life = module.exports.generateLife(player, parameters);
	const result = await db.insertDocument(life, "lives");
	// common.log("debug", "* createLife:", result);
	return result;
};

module.exports.getLife = async(id) => {
	const result = await db.getDocument(id, "lives");
	// common.log("debug", "* getLife:", result);
	return result;
};

module.exports.getHighScores = async(page = 0, limit = 10) => {
	const skip = page * limit;
	const results = await db.findDocumentsFull({
		alive: false
	}, {
		_id: 1, name: 1, alive: 1, score: 1, guest: 1
	}, {
		score: -1
	}, skip, limit, "lives");
	// common.log("debug", "* getHighScores:", results);
	return results;
};

module.exports.replaceLife = async(life) => {
	// validate
	const valid = validateLife(life);
	// if this player object isn't valid...
	if (valid.status === false) {
		// ...return the error object
		throw new Error("Life object invalid / lifeModel.replaceLife");
	}
	const result = await db.replaceDocument({
		_id: life._id
	}, life, "lives");
	// common.log("debug", "* replaceLife:", result);
	return result;
};

module.exports.changeTurn = (life, turns) => {
	life.listings.market = market.generateMarketListings(life, turns);
	life.listings.airport = airport.generateAirportListings(life);
	// generate vendor listings for each enabled vendor
	life.listings.vendors = {};
	for (const vendor of game.vendors.enabled) {
		life.listings.vendors[vendor] = vendors.generateVendorListings(vendor, life);
	}
	life = bank.handleInterest(life, turns);
	life = hotel.doHotelCheckOut(life);
	life = police.doSimulateEncounter(life);
	life = events.doSimulateEvents(life);
	life.current.turn += turns;
	return life;
};

module.exports.checkDeath = (life) => {
	const lifeFinance = life.current.finance;
	// * Pity Death
	if (lifeFinance.cash == 0 && lifeFinance.savings == 0) {
		// flat broke
		if (lifeFinance.debt > (game.bank.starting_debt * 3)) {
			// in debt
			life.alive = false;
			// give them a eulogy
			life.eulogy = deathsJSON.bankrupt;
			return life;
		}
	}
	// * Dead Death
	const lifeHealth = life.current.health;
	if (lifeHealth.points <= 0) {
		// you're dead
		life.alive = false;
		life.eulogy = deathsJSON.dead;
		return life;
	}
	// * Turn Death
	if (game.turns != 0) {
		if (life.current.turn >= game.turns) {
			// you're dead
			life.alive = false;
			// give them a eulogy
			life.eulogy = deathsJSON.old_age;
		}
	}
	return life;
};

module.exports.getScore = (life) => {
	const totalCash = life.current.finance.cash;
	const totalAssets = life.current.finance.savings - life.current.finance.debt;
	const totalTurns = life.current.turn;
	const totalStash = life.current.storage.total - life.current.storage.available;
	// sort of just a rough pass at things
	// cash is a little easier to get, doesn't require as much forethought
	const cashPoints = totalCash * game.score.cash_mod;
	// money in the bank is harder to get than money in hand
	const assetsPoints = totalAssets * game.score.assets_mod;
	// more turns = better/harder?
	const turnsPoints = totalTurns * game.score.turns_mod;
	// storage that's taken should count for SOMETHING, although not much
	const stashPoints = totalStash * game.score.stash_mod;
	const score = Math.round(cashPoints + assetsPoints + turnsPoints + stashPoints);
	return score;
};

// market
module.exports.saveMarketTransaction = market.saveMarketTransaction;
module.exports.generateMarketListings = market.generateMarketListings;
module.exports.dumpInventory = market.dumpInventory;

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

// vendors
module.exports.saveVendorTransaction = vendors.saveVendorTransaction;

module.exports.generateLife = (player, parameters) => {
	const life = {
		_id: `${player._id}_${Date.now()}`,
		name: player.username,
		alive: true,
		guest: (player.guest) ? player.guest : false,
		starting: {
			turn: 1,
			event: localization("event_starting"),
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
				size: parameters.location.size,
				coordinates: parameters.location.coordinates
			},
			health: {
				points: game.person.starting_hp,
				max: game.person.max_hp,
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
			upgrades: {},
			storage: {
				available: game.market.starting_storage,
				total: game.market.starting_storage
			},
			weapon: {
				name: "Claws",
				damage: 5
			}
		},
		current: {},
		listings: {
			market: [],
			airport: [],
			vendors: {}
		},
		actions: [
			{
				turn: 0,
				type: "airport",
				data: {
					id: parameters.location.id,
					city: parameters.location.city,
					country: parameters.location.country,
					continent: parameters.location.continent,
					size: parameters.location.size,
					coordinates: parameters.location.coordinates
				}
			}
		]
	};
	// adjust the police awareness for the current location here, for the linter
	life.starting.police.awareness[parameters.location.country] = game.police.starting_heat;
	// fill out vendors from the list of enabled vendors
	for (const vendor of game.vendors.enabled) {
		if (game.vendors[vendor].start_open === true) {
			// they are open, generate listings
			life.listings.vendors[vendor] = vendors.generateVendorListings(vendor, life);
		} else {
			// create an empty object for this vendor
			life.listings.vendors[vendor] = {};
			life.listings.vendors[vendor].open = game.vendors[vendor].start_open;
			life.listings.vendors[vendor].stock = [];
		}
	}
	// we just created life.	let that dwell on you for a little bit.
	// this is where it all starts.
	life.current = life.starting;
	// simulate the prices here
	life.listings.market = market.generateMarketListings(life);
	life.listings.airport = airport.generateAirportListings(life);
	return life;
};

function validateLife(life) {
	if (!life._id) {return {status: false, reason: "No ID"};}
	if (!life.current) {return {status: false, reason: "No Current Object"};}
	return {status: true};
}
