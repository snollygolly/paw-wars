"use strict";

const game = require("../../game.json");
const items = require("./items.json");
const events = require("./events.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");

module.exports.doSimulateEncounter = function doSimulateEncounter(life) {
	let newLife = JSON.parse(JSON.stringify(life));
	// see if we even get an event
	const eventRoll = common.getRandomInt(0, 100);
	// calculate our encounter rate for our location
	const encounterRate = newLife.current.police.heat + getAwarenessHeat(newLife);
	// see if our roll is good enough for an encounter
	if (encounterRate <= eventRoll || life.testing === true) {
		// they didn't get an encounter
		newLife.current.police.encounter = null;
		return newLife;
	}
	newLife = module.exports.simulateEncounter(newLife);
	return newLife;
};

module.exports.simulateEncounter = function simulateEncounter(life) {
	const newLife = JSON.parse(JSON.stringify(life));
	let encounter;

	// console.log("* simulateEncounter:", newLife);
	return newLife;
};

function getAwarenessHeat(life) {
	// get the heat for the specific country's awareness
	let heat = 0;
	if (life.current.police.awareness[life.current.location.country]) {
		heat += life.current.police.awareness[life.current.location.country];
	}
	return heat;
}
