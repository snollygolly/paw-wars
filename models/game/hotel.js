"use strict";

const common = require('../../helpers/common');
const model = require('../game_life.js');

module.exports.saveHotelCheckIn = function* saveHotelCheckIn(id){
  // get the latest copy from the database
  let life = yield model.getLife(id);
  // run all the transaction logic against it and get it back
  life = module.exports.doHotelCheckIn(life);
  // check for errors
  if (life.error === true){
    // exit early
    return life;
  }
  // now replace it in the DB
  life = yield model.replaceLife(life);
  return life;
}

module.exports.doHotelCheckIn = function doHotelCheckIn(life){
	let newLife = JSON.parse(JSON.stringify(life));
	newLife.current.hotel = true;
	newLife.actions.push({
		turn: newLife.current.turn,
		type: "hotel"
	})
	return newLife;
}
