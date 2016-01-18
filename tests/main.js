'use strict';

const chai = require('chai');
const expect = chai.expect;

module.exports.common = require('../helpers/common');
module.exports.model = require('../models/game_life');
module.exports.airport = require('../models/game/airport');
module.exports.places = require('../models/game/places.json');
module.exports.items = require('../models/game/items.json');

module.exports.config = {
  UNITS: 10,
  ITEM: module.exports.items[0],
  PLAYER: {
    id: "testing"
  },
  LOCATION: {
    location: module.exports.places[0],
    destination: module.exports.places[10]
  }
}

// test modules
const lifeTest = require('./game/life');

// start setting up life
let life = module.exports.model.generateLife(module.exports.config.PLAYER, module.exports.config.LOCATION);

//module.exports.newLife;
// this is required because evidently you CAN change a const if you're crafty enough
//module.exports.oldLife = JSON.parse(JSON.stringify(life));

// start doing the testing
describe('Life Model - Base Validation', () => {lifeTest.describeBaseValidation(life)});
describe('Life Model - Starting Validation', () => {lifeTest.describeStartingValidation(life)});
describe('Life Model - Current Validation', () => {lifeTest.describeCurrentValidation(life)});
