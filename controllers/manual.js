"use strict";

const config = require("../config.json");
const game = require("../game.json");
const fs = require("fs");

module.exports.index = function* index() {
	const whitelist = fs.readdirSync("views/manual/");
	let partialName = "index";
	if (this.params.page) {
		// they passed a page, let's use it
		partialName = this.params.page;
		if (whitelist.indexOf(`${partialName}.md`) === -1) {
			// this page isn't on the whitelist, fail!
			throw new Error("Page not in whitelist / manualController:index");
		}
	}
	yield this.render("manual/index", {
		partial: partialName
	});
};
