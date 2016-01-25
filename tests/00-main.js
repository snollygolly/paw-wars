"use strict";

const game = require("../game.json");
module.exports.common = require("../helpers/common");
// main model
module.exports.model = require("../models/game_life");
// game sub models
module.exports.market = require("../models/game/market");
module.exports.airport = require("../models/game/airport");
module.exports.bank = require("../models/game/bank");
module.exports.events = require("../models/game/events");
module.exports.hotel = require("../models/game/hotel");
module.exports.police = require("../models/game/police");
// JSON data
module.exports.placesJSON = require("../models/game/data/places.json");
module.exports.itemsJSON = require("../models/game/data/items.json");
module.exports.policeJSON = require("../models/game/data/police.json");
// for setting testing values
module.exports.config = {
	UNITS: 10,
	AMOUNT: 500,
	ITEM: module.exports.itemsJSON[8],
	PLAYER: {
		id: "testing"
	},
	LOCATION: {
		location: module.exports.placesJSON[0],
		destination: module.exports.placesJSON[10]
	},
	GAME: game
};
