"use strict";

const config = require("../config.json");
const game = require("../game.json");

module.exports.index = function* index() {
	let partialName = "index";
	if (this.params.page) {
		// they passed a page, let's use it
		partialName = this.params.page;
	}
	// loop through all available manual markdowns, build a list of "allowed"
	// check to see if the one they want is "allowed", otherwise reject it
	yield this.render("manual/index", {
		partial: partialName
	});
};
