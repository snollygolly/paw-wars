"use strict";

const game = require("../../game.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");
const policeJSON = require("./data/police.json");

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
		mode: "discovery"
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
		chasing: doChasingMode,
		// and when we're all done...
		end: doEndMode
	};
	newLife.current.police = handleEncounter[life.current.police.encounter.mode](newLife);
	// console.log("* simulateEncounter:", newLife);
	return newLife;

	function doDiscoveryMode(lifeObj) {
		// *** You are getting pulled over
		let police = lifeObj.current.police;
		// handle initial actions
		if (!police.encounter.action) {
			// the player hasn't had a chance to reply yet
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
		// set up reply actions
		const actionObj  = {
			"permit_search": (policeObj) => {
				// *** You are giving consent for the search
				policeObj = changeModes(policeObj, "searching");
				lifeObj.current.police = policeObj;
				return handleEncounter[policeObj.encounter.mode](lifeObj, "consent");
			},
			"deny_search": (policeObj) => {
				// *** You are not giving consent for the search
				policeObj = changeModes(policeObj, "investigation");
				lifeObj.current.police = policeObj;
				return handleEncounter[policeObj.encounter.mode](lifeObj);
			}
		};
		return actionObj[police.encounter.action](police);
	}

	function doInvestigationMode(lifeObj) {
		// *** Police are looking around after you refused consent
		let police = lifeObj.current.police;
		// handle initial actions
		if (!police.encounter.action) {
			// the player hasn't had a chance to reply yet
			police.encounter.message = policeJSON.messages.investigation;
			police.encounter.choices = [
				policeJSON.choices.admit_guilt,
				policeJSON.choices.deny_guilt,
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
		// set up reply actions
		const actionObj  = {
			"admit_guilt": (policeObj) => {
				// *** You've admitted that you are guilty of a crime
				if (lifeObj.current.storage.available === lifeObj.current.storage.total) {
					// they aren't carrying anything
					policeObj = changeModes(policeObj, "released");
				} else {
					policeObj = changeModes(policeObj, "detain");
				}

				lifeObj.current.police = policeObj;
				return handleEncounter[policeObj.encounter.mode](lifeObj);
			},
			"deny_guilt": (policeObj) => {
				// *** You are denying any wrongdoing
				// TODO: roll to see if the cop has probable cause
				policeObj = changeModes(policeObj, "end");
				lifeObj.current.police = policeObj;
				return handleEncounter[policeObj.encounter.mode](lifeObj);
			}
		};
		return actionObj[police.encounter.action](police);
	}

	function doSearchingMode(lifeObj, method) {
		// *** The police are searching your car, either because you let them, or they have PC
		let police = lifeObj.current.police;
		// handle the message change between a probable cause search and a consent search
		const allMessages = {
			consent: policeJSON.messages.search_consent,
			probable_cause: policeJSON.messages.search_probable_cause
		};
		const searchMessage = allMessages[method];
		// handle initial actions
		if (!police.encounter.action) {
			// the player hasn't had a chance to reply yet
			police.encounter.message = searchMessage;
			police.encounter.choices = [
				policeJSON.choices.comply_search,
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
		// set up reply actions
		const actionObj  = {
			"comply_search": (policeObj) => {
				// *** You do not resist the officer during his search
				if (lifeObj.current.storage.available === lifeObj.current.storage.total) {
					// they aren't carrying anything
					policeObj = changeModes(policeObj, "released");
				}else{
					// TODO: roll here to see if they find what you're carrying
					policeObj = changeModes(policeObj, "detain");
				}
				lifeObj.current.police = policeObj;
				return handleEncounter[policeObj.encounter.mode](lifeObj);
			}
		};
		return actionObj[police.encounter.action](police);
	}

	function doDetainMode(police) {
		// *** You are being detained, this is your last chance
		return police;
	}

	function doCustodyMode(police) {
		// *** You are being taken into custody and can no longer escape
		return police;
	}

	function doReleasedMode(police) {
		// *** You are free to leave
		return police;
	}

	function doFightingMode(police) {
		// *** You are engaged in violence with the police
		return police;
	}

	function doChasingMode(police) {
		// *** You are running and the police are actively pursuing you
		return police;
	}

	function doEndMode(police) {
		// *** Tally results and allow player to proceed
		console.log("end mode hit");
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

function changeModes(police, mode) {
	delete police.encounter.action;
	police.encounter.mode = mode;
	return police;
}
