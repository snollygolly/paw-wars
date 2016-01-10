"use strict";

const config = require('../config.json');
const r = require('rethinkdb');

let connection

function* createConnection() {
  try{
    // Open a connection and wait for r.connect(...) to be resolve
    connection = yield r.connect(config.site.db);
  }
  catch(err) {
    console.error(err);
  }
}

module.exports.checkPlayer = function * checkPlayer(player){
  // set up the connection
  yield createConnection();
  // check to see if the document exists
  let cursor = yield r.table('players').getAll(player.id).run(connection);
  let result = yield cursor.next();
  if (result === null){
    // they don't have an account, let's create one
    result = yield module.exports.createPlayer(player);
  }
  connection.close();
  return result;
}

module.exports.createPlayer = function * createPlayer(player){
  // set up the connection
  yield createConnection();
  // update the createdAt time
  player.createdAt = r.now();
  // insert and get the result
  let result = yield r.table('players').insert(player, {returnChanges: true}).run(connection);
  connection.close();
  return result.new_val;
}
