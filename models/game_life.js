"use strict";

const config = require('../config.json');
const places = require('./places.json');
const items = require('./items.json');
const r = require('rethinkdb');

let connection;

function* createConnection() {
  try{
    // Open a connection and wait for r.connect(...) to be resolve
    connection = yield r.connect(config.site.db);
  }
  catch(err) {
    console.error(err);
  }
}

module.exports.createLife = function* createLife (player, parameters){
  // set up the connection
  yield createConnection();
  //create the life object
  let life = generateLife(player, parameters);
  let result = yield r.table('lives').insert(life, {returnChanges: true}).run(connection);
  connection.close();
  //console.log("* createLife:", result.changes[0].new_val);
  return result.changes[0].new_val;
}

module.exports.getLife = function* getLife(life){
  // set up the connection
  yield createConnection();
  // check to see if the document exists
  let result = yield r.table('lives').get(life.id).run(connection);
  if (result === null){
    throw new Error("Life document not found / lifeModel.getLife");
  }
  connection.close();
  //console.log("* getLife:", result);
  return result;
}

function validateLife(life){
  if (!life.id){return {status: false, reason: "No ID"};}
  return {status: true};
}

function generateLife(player, parameters){
  let life = {
    id: player.id + "_" + Date.now(),
    starting: {
      location: {
        id: parameters.location.id,
        city: parameters.location.city,
        country: parameters.location.country,
        continent: parameters.location.continent
      },
      health: {
        points: 100,
        status: null
      },
      finance: {
        cash: config.game.starting_cash,
        savings: 0,
        debt: config.game.starting_debt
      },
      inventory: []
    },
    current: {},
    turns: []
  };
  life.starting.inventory.push({id: items[0].id, units: 1});
  // we just created life.  let that dwell on you for a little bit.
  // this is where it all starts.
  life.current = life.starting;
  return life;
}
/*
turns: [
  {
    day: 0,
    location: {
      city: places[0].city,
      country: places[0].country,
      continent: places[0].continent
    },
    actions: [
      {
        type: "bought_item",
        meta: {
          id: items[0].id,
          units: 1
        }
      }
    ]
  }
]
*/
