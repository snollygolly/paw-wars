"use strict";

const game = require("../../game.json");
const items = require("./items.json");
const events = require("./events.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");
const policeJSON = require("./police.json");

module.exports.doSimulateEncounter = function doSimulateEncounter(life) {
	let newLife = JSON.parse(JSON.stringify(life));
	// see if we even get an event
	const eventRoll = common.getRandomInt(0, game.police.heat_cap);
	// calculate our encounter rate for our location
	const encounterRate = getTotalHeat(newLife);
	// see if our roll is good enough for an encounter
	if (encounterRate <= eventRoll || life.testing === true) {
		// they didn't get an encounter
		newLife.current.police.encounter = null;
		return newLife;
	}
	newLife = module.exports.startEncounter(newLife);
	return newLife;
};

module.exports.startEncounter = function startEncounter(life) {
	let newLife = JSON.parse(JSON.stringify(life));
	const totalHeat = getTotalHeat(life);
	const totalOfficers = Math.ceil(totalHeat / (game.police.heat_cap / game.police.total_officers)) - 1;
	// if we don't need any officers, we don't need an event
	if (totalOfficers === 0) {
		newLife.current.police.encounter = null;
		return newLife;
	}
	const encounter = {
		id: Date.now(),
		officers: totalOfficers,
		total_hp: totalOfficers * game.person.starting_hp,
		mode: "discovery",
		history: []
	};
	newLife.current.police.encounter = encounter;
	newLife = module.exports.simulateEncounter(newLife);
	// console.log("* startEncounter:", newLife);
	return newLife;
};

module.exports.simulateEncounter = function simulateEncounter(life) {
	const newLife = JSON.parse(JSON.stringify(life));
	// see where we're at in the encounter
	const handleEncounter = {
		// discovery is the phase where the officer is trying to figure out what's going on
		// the officer will ask questions and may ask to search
		discovery: doDiscoveryMode,
		// investigation mode is where you've denied the officer permissions to search and
		// he's seeing if he has probably cause to conduct a search anyway
		investigation: doInvestigationMode,
		// searching is the phaser where the officer is actively searching your storage
		// you either consented during discovery, or the officer is claiming probable cause
		searching: doSearchingMode,
		// the officer found something, or caught you shooting at him, or something
		// it's not good, you're about to go to jail
		detain: doDetainMode,
		// you're in the back of a cop car, not much to do about it now
		custody: doCustodyMode,
		// you're free to leave, those cops don't have anything on you!
		released: doReleasedMode,
		// fighting is when you've decided to shoot at the officer and he's now engaged in combat with you
		fighting: doFightingMode,
		// chasing is when you've attempted to flee and the officer is giving chase
		chasing: doChasingMode
	};
	newLife.current.police = handleEncounter[life.current.police.encounter.mode](newLife.current.police);
	// console.log("* simulateEncounter:", newLife);
	return newLife;

	function doDiscoveryMode(police) {
		police.encounter.message = policeJSON.messages.discovery;
		police.encounter.choices = [
			policeJSON.choices.permit_search,
			policeJSON.choices.deny_search,
			policeJSON.choices.hiss,
			policeJSON.choices.attack,
			policeJSON.choices.run
		];
		const history = {
			id: police.encounter.id,
			encounter: police.encounter
		};
		police.history.push(history);
		return police;
	}

	function doInvestigationMode(police) {
		return police;
	}

	function doSearchingMode(police) {
		return police;
	}

	function doDetainMode(police) {
		return police;
	}

	function doCustodyMode(police) {
		return police;
	}

	function doReleasedMode(police) {
		return police;
	}

	function doFightingMode(police) {
		return police;
	}

	function doChasingMode(police) {
		return police;
	}
};

function getTotalHeat(life) {
	return life.current.police.heat + getAwarenessHeat(life);
}

function getAwarenessHeat(life) {
	// get the heat for the specific country's awareness
	let heat = 0;
	if (life.current.police.awareness[life.current.location.country]) {
		heat += life.current.police.awareness[life.current.location.country];
	}
	return heat;
}
