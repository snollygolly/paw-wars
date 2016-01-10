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

module.exports.createLife = function createLife (life){
  // set up the connection
  yield createConnection();
  //create the life object
  let newLife = generateLife(life);
  let result = yield r.table('life').insert(newLife, {returnChanges: true}).run(connection);
  connection.close();
  //console.log("* createLife:", result.changes[0].new_val);
  return result.changes[0].new_val;
}

module.exports.getLife = function * getLife(life){
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

function generateLife(oldLife){
  let life = {
    status: {
      location: {
        city: places[0].city,
        country: places[0].country,
        continent: places[0].continent
      },
      health: {
        points: 100,
        status: null
      },
      finance: {
        cash: config.game.starting_cash,
        debt: config.game.starting_debt
      }
      inventory: {}
    },
    turns: []
  };
  life.inventory[items[0].id] = 1;
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
