"use strict";

const config = require('../config.json');
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

module.exports.convertProfile = function convertProfile (profile){
  let player = {
    id: profile.id,
    username: profile.username,
    name: profile.displayName,
    lives: []
  };
  return player;
}

module.exports.getPlayer = function * getPlayer(player){
  // set up the connection
  yield createConnection();
  // try to get the player profile, expect that this might fail
  let result = yield r.table('players').get(player.id).run(connection);
  if (result === null){
    // they don't exist, let's create them
    result = yield module.exports.createPlayer(player);
  }
  connection.close();
  //console.log("* getPlayer:", result);
  return result;
}

module.exports.createPlayer = function * createPlayer(player){
  // set up the connection
  yield createConnection();
  // update the createdAt time
  player.createdAt = r.now();
  // validate
  let valid = validatePlayer(player);
  // if this player object isn't valid...
  if (valid.status === false){
    // ...return the error object
    throw new Error("Player object invalid / playerModel.createPlayer");
  }
  // insert and get the result
  let result = yield r.table('players').insert(player, {returnChanges: true}).run(connection);
  connection.close();
  //console.log("* createPlayer:", result.changes[0].new_val);
  return result.changes[0].new_val;
}

module.exports.replacePlayer = function * replacePlayer(player){
  // set up the connection
  yield createConnection();
  // update the createdAt time
  player.createdAt = r.now();
  // insert and get the result
  // validate
  let valid = validatePlayer(player);
  // if this player object isn't valid...
  if (valid.status === false){
    // ...return the error object
    throw new Error("Player object invalid / playerModel.replacePlayer");
  }
  let result = yield r.table('players').get(player.id).replace(player, {returnChanges: true}).run(connection);
  connection.close();
  //console.log("* replacePlayer:", result.changes[0].new_val);
  return result.changes[0].new_val;
}

function validatePlayer(player){
  if (!player.id){return {status: false, reason: "No ID"};}
  if (!player.username){return {status: false, reason: "No Username"};}
  if (!player.name){return {status: false, reason: "No Name"};}
  return {status: true};
}
