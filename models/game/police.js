"use strict";

const game = require("../../game.json");
const common = require("../../helpers/common");
const model = require("../game_life.js");
const policeJSON = require("./data/police.json");
const deathsJSON = require("./data/deaths.json");

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

module.exports.saveEncounter = function* saveEncounter(id, action) {
	// get the latest copy from the database
	let life = yield model.getLife(id);
	life.current.police.encounter.action = action;
	// run all the transaction logic against it and get it back
	life = module.exports.simulateEncounter(life);
	// check for errors
	if (life.error === true) {
		// exit early
		return life;
	}
	// now replace it in the DB
	life = yield model.replaceLife(life);
	return life;
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
		// searching is the phase where the officer is actively searching your storage
		// you either consented during discovery, or the officer is claiming probable cause
		searching: doSearchingMode,
		// the officer found something, or caught you shooting at him, or something
		// it's not good, you're about to go to jail
		detained: doDetainedMode,
		// and when we're all done...
		end: doEndMode
	};
	// set up the default actions
	const handleActions = {
		// you hiss at the officer, it doesn't usually work in your favor
		hiss: doHissAction,
		// you run from the officer, it sometimes works
		run: doRunAction,
		// you attempt to fight the officer, works, but depends on the situation
		fight: doFightAction
	};
	// set up the default action
	const handleDefaultAction = handleActions[life.current.police.encounter.action];
	// check to see if it's one of the defaults
	if (typeof(handleDefaultAction) !== "undefined") {
		// if it is, let's do that instead of whatever else we were going to do
		return handleDefaultAction(newLife);
	}
	// if they didn't hit a default action, check modes
	return handleEncounter[life.current.police.encounter.mode](newLife);

	function doHissAction(lifeObj) {
		// *** You have just hissed at the officer
		const police = lifeObj.current.police;
		const roll = common.rollDice(0, 1, police.meta);
		if (roll >= game.police.hiss_success_rate) {
			// they failed the roll, and have enraged the officer
			lifeObj.current.health.points -= game.police.base_damage * 2;
			// increase heat
			lifeObj.current.police.heat += game.police.heat_rate;
			// death check
			if (lifeObj.current.health.points <= 0) {
				// they are dead :(
				lifeObj.current.police.encounter.reason = "dead";
				// give them a eulogy
				lifeObj.eulogy = deathsJSON.hissed;
				// change the modes
				lifeObj = changeModes(lifeObj, "end");
				return lifeObj;
			}
			lifeObj.current.police.encounter.reason = "hiss_failure";
			// change the modes
			lifeObj = changeModes(lifeObj, "detained");
			return lifeObj;
		}
		// they succeeded with the roll and have been released
		lifeObj.current.police.encounter.reason = "hiss_success";
		// change the modes
		lifeObj = changeModes(lifeObj, "end");
		return lifeObj;
	}

	function doRunAction(lifeObj) {
		// *** You have just ran from the officer
		const police = lifeObj.current.police;
		const roll = common.rollDice(0, 1, police.meta);
		if (roll >= game.police.run_success_rate) {
			// they failed the roll, and are not escaping the officer
			lifeObj.current.health.points -= game.police.base_damage;
			// increase heat
			lifeObj.current.police.heat += game.police.heat_rate;
			// death check
			if (lifeObj.current.health.points <= 0) {
				// they are dead :(
				lifeObj.current.police.encounter.reason = "dead";
				// give them a eulogy
				lifeObj.eulogy = deathsJSON.running;
				// change the modes
				lifeObj = changeModes(lifeObj, "end");
				return lifeObj;
			}
			lifeObj.current.police.encounter.reason = "run_failure";
			// change the modes
			lifeObj = changeModes(lifeObj, "detained");
			return lifeObj;
		}
		// they succeeded with the roll and have been released
		lifeObj.current.police.encounter.reason = "run_success";
		// change the modes
		lifeObj = changeModes(lifeObj, "end");
		return lifeObj;
	}

	function doFightAction(lifeObj) {
		// *** You have just attacked the officer
		const police = lifeObj.current.police;
		// for testing, min == win, max == lose
		const playerRoll = common.rollDice(0, 1, police.meta_player);
		const policeRoll = common.rollDice(0, 1, police.meta_police);
		// who much damage the entity is dealing this turn
		const playerDamage = doAttack("player", playerRoll);
		const policeDamage = doAttack("police", policeRoll);
		// see who is smaller, player or police
		// TODO: make who goes first actually matter
		lifeObj.current.police.encounter.reason = (playerRoll < policeRoll) ? "fight_success" : "fight_failure";
		// increase heat
		lifeObj.current.police.heat += (game.police.heat_rate * 2);
		// TODO: death check here
		police.encounter.total_hp -= playerDamage;
		if (police.encounter.total_hp <= 0) {
			// you killed all the police
			lifeObj.current.police.encounter.reason = "fight_success";
			// change the modes
			lifeObj = changeModes(lifeObj, "end");
			return lifeObj;
		}
		lifeObj.current.health.points -= policeDamage;
		// player death check
		if (lifeObj.current.health.points <= 0) {
			// they are dead :(
			lifeObj.current.police.encounter.reason = "dead";
			// give them a eulogy
			lifeObj.eulogy = deathsJSON.shot;
			// change the modes
			lifeObj = changeModes(lifeObj, "end");
			return lifeObj;
		}
		// change the modes
		lifeObj = changeModes(lifeObj, "detained");
		return lifeObj;

		function doAttack(entity, roll) {
			if (roll <= game.police[`accuracy_${entity}_base`]) {
				return module.exports.getDamage(lifeObj, entity);
			}
			return 0;
		}
	}

	function doDiscoveryMode(lifeObj) {
		// *** You are getting pulled over
		const police = lifeObj.current.police;
		if (!police.encounter.action) {
			// this is their first encounter in this mode
			return updateEncounter("discovery", ["permit_search", "deny_search"], lifeObj);
		}
		// set up reply actions
		const actionObj  = {
			"permit_search": (actionLifeObj) => {
				// *** You are giving consent for the search
				actionLifeObj.current.police.encounter.reason = "search_consent";
				return changeModes(actionLifeObj, "searching");
			},
			"deny_search": (actionLifeObj) => {
				// *** You are not giving consent for the search
				// increase heat
				actionLifeObj.current.police.heat += game.police.heat_rate;
				return changeModes(actionLifeObj, "investigation");
			}
		};
		return actionObj[police.encounter.action](lifeObj);
	}

	function doInvestigationMode(lifeObj) {
		const police = lifeObj.current.police;
		// *** Police are looking around after you refused consent
		if (!police.encounter.action) {
			// this is their first encounter in this mode
			return updateEncounter("investigation", ["admit_guilt", "deny_guilt"], lifeObj);
		}
		// set up reply actions
		const actionObj  = {
			"admit_guilt": (actionLifeObj) => {
				// *** You've admitted that you are guilty of a crime
				if (lifeObj.current.storage.available === lifeObj.current.storage.total) {
					// they aren't carrying anything
					// increase heat
					lifeObj.current.police.heat += game.police.heat_rate;
					actionLifeObj.current.police.encounter.reason = "crazy_person";
					return changeModes(actionLifeObj, "end");
				}
				actionLifeObj.current.police.encounter.reason = "admit_guilt";
				return changeModes(actionLifeObj, "detained");
			},
			"deny_guilt": (actionLifeObj) => {
				// *** You are denying any wrongdoing
				if (lifeObj.current.storage.available === lifeObj.current.storage.total) {
					// they aren't carrying anything
					actionLifeObj.current.police.encounter.reason = "investigation_failure";
					return changeModes(actionLifeObj, "end");
				}
				// you have SOMETHING, let's roll to see if he sees it
				const roll = common.rollDice(0, 1, actionLifeObj.current.police.meta);
				// TODO: weight this, more used storage, higher chance of them finding it
				if (roll >= game.police.investigation_proficiency) {
					// they see something suspect (probable cause)
					actionLifeObj.current.police.encounter.reason = "search_probable_cause";
					return changeModes(actionLifeObj, "searching");
				}
				// they don't see anything, so you're free to leave
				actionLifeObj.current.police.encounter.reason = "investigation_failure";
				return changeModes(actionLifeObj, "end");
			}
		};
		return actionObj[police.encounter.action](lifeObj);
	}

	function doSearchingMode(lifeObj) {
		// *** The police are searching your car, either because you let them, or they have PC
		const police = lifeObj.current.police;
		const reason = police.encounter.reason;
		if (!police.encounter.action) {
			// this is their first encounter in this mode
			return updateEncounter(reason, ["comply_search"], lifeObj);
		}
		// set up reply actions
		const actionObj  = {
			"comply_search": (actionLifeObj) => {
				// *** You do not resist the officer during his search
				if (lifeObj.current.storage.available === lifeObj.current.storage.total) {
					// they aren't carrying anything
					lifeObj.current.police.encounter.reason = "search_failure";
					return changeModes(actionLifeObj, "end");
				}
				// roll here to see if they find what you're carrying
				const roll = common.rollDice(0, 1, lifeObj.current.police.meta);
				// TODO: weight this, more used storage, higher chance of them finding it
				if (roll >= game.police.search_proficiency) {
					// they found your stash...man
					lifeObj.current.police.encounter.reason = "search_successful";
					return changeModes(actionLifeObj, "detained");
				}
				// you somehow didn't get caught
				lifeObj.current.police.encounter.reason = "search_failure";
				return changeModes(actionLifeObj, "end");
			}
		};
		return actionObj[police.encounter.action](lifeObj);
	}

	function doDetainedMode(lifeObj) {
		// *** You are being detained, this is your last chance
		const police = lifeObj.current.police;
		const reason = police.encounter.reason;
		if (!police.encounter.action) {
			// this is their first encounter in this mode
			return updateEncounter(reason, ["comply_detain"], lifeObj);
		}
		// set up reply actions
		const actionObj  = {
			"comply_detain": (actionLifeObj) => {
				// *** You do not resist the officer during his search
				// increase heat
				actionLifeObj.current.police.heat += game.police.heat_rate;
				actionLifeObj.current.police.encounter.reason = "comply_detain";
				return changeModes(actionLifeObj, "end");
			}
		};
		return actionObj[police.encounter.action](lifeObj);
	}

	function doEndMode(lifeObj) {
		// *** Tally results and allow player to proceed
		const police = lifeObj.current.police;
		const reason = police.encounter.reason;
		if (!police.encounter.action) {
			// this is their first encounter in this mode
			return updateEncounter(reason, ["continue"], lifeObj);
		}
		// set up reply actions
		const actionObj  = {
			"continue": (actionLifeObj) => {
				// *** This is the end of the encounter
				// add the encounter/history to the actions array
				lifeObj.actions.push({
					turn: lifeObj.current.turn,
					type: "police",
					data: lifeObj.current.police
				});
				// reset the actual values
				lifeObj.current.police.encounter = null;
				lifeObj.current.police.history = [];
				return lifeObj;
			}
		};
		return actionObj[police.encounter.action](lifeObj);
	}
};

module.exports.getDamage = function getDamage(life, entity) {
	if (entity == "player") {
		// this is damage that the player is doing
		return life.current.weapon.damage + game.police.base_damage;
	} else if (entity == "police") {
		// this is damage that the police is doing
		return life.current.police.encounter.officers * game.police.base_damage;
	}
	return null;
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

function changeModes(lifeObj, mode) {
	lifeObj.current.police = doChangeModes(lifeObj.current.police, mode);
	lifeObj = module.exports.simulateEncounter(lifeObj);
	return lifeObj;
}

function doChangeModes(police, mode) {
	// get rid of the action if there is one
	delete police.encounter.action;
	// set the mode
	police.encounter.mode = mode;
	return police;
}

function updateEncounter(action, choices, lifeObj) {
	lifeObj.current.police.encounter.message = policeJSON.messages[action];
	lifeObj.current.police.encounter.choices = [];
	for (const choice of choices) {
		lifeObj.current.police.encounter.choices.push(policeJSON.choices[choice]);
	}
	// we don't need these stock choices if this is the end
	if (lifeObj.current.police.encounter.mode != "end") {
		// add the default choices
		lifeObj.current.police.encounter.choices = lifeObj.current.police.encounter.choices.concat([
			policeJSON.choices.hiss,
			policeJSON.choices.fight,
			policeJSON.choices.run
		]);
	}
	const history = {
		id: lifeObj.current.police.encounter.id,
		encounter: lifeObj.current.police.encounter
	};
	lifeObj.current.police.history.push(history);
	return lifeObj;
}
