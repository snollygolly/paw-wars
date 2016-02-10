"use strict";

const config = require("../config.json");
const game = require("../game.json");

module.exports.index = function* index() {
	yield this.render("manual/index", {
		game: game
	});
};
