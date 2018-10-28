"use strict";

const common = require("../../helpers/common");
const model = require("../game_life.js");

module.exports.saveHotelCheckIn = async(id) => {
	// get the latest copy from the database
	let life = await model.getLife(id);
	// run all the transaction logic against it and get it back
	life = module.exports.doHotelCheckIn(life);
	// check for errors
	if (life.error === true) {
		// exit early
		return life;
	}
	// now replace it in the DB
	life = await model.replaceLife(life);
	return life;
};

module.exports.doHotelCheckIn = function doHotelCheckIn(life) {
	const newLife = JSON.parse(JSON.stringify(life));
	newLife.current.hotel = true;
	newLife.actions.push({
		turn: newLife.current.turn,
		type: "hotel",
		data: "check in"
	});
	return newLife;
};

module.exports.doHotelCheckOut = function doHotelCheckOut(life) {
	const newLife = JSON.parse(JSON.stringify(life));
	newLife.current.hotel = false;
	newLife.actions.push({
		turn: newLife.current.turn,
		type: "hotel",
		data: "check out"
	});
	return newLife;
};
