"use strict";

const config = require("../config.json");
const game = require("../game.json");
const fs = require("fs");

module.exports.index = async(ctx) => {
	const whitelist = fs.readdirSync("views/manual/");
	let partialName = "index";
	if (ctx.params.page) {
		// they passed a page, let's use it
		partialName = ctx.params.page;
		if (whitelist.indexOf(`${partialName}.md`) === -1) {
			// this page isn't on the whitelist, fail!
			throw new Error("Page not in whitelist / manualController:index");
		}
	}
	await ctx.render("manual/index", {
		partial: partialName
	});
};
