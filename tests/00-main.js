'use strict';

const game = require('../game.json');
module.exports.common = require('../helpers/common');
// main model
module.exports.model = require('../models/game_life');
// game sub models
module.exports.market = require('../models/game/market');
module.exports.airport = require('../models/game/airport');
module.exports.bank = require('../models/game/bank');
module.exports.events = require('../models/game/events');
module.exports.hotel = require('../models/game/hotel');
// JSON data
module.exports.places = require('../models/game/places.json');
module.exports.items = require('../models/game/items.json');
// for setting testing values
module.exports.config = {
  UNITS: 10,
  AMOUNT: 500,
  ITEM: module.exports.items[8],
  PLAYER: {
    id: "testing"
  },
  LOCATION: {
    location: module.exports.places[0],
    destination: module.exports.places[10]
  },
  GAME: game
}
