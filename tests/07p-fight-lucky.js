"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const police = main.police;
const policeJSON = main.policeJSON;

let life;

describe("Police - Simulating Encounter (Fight, Lucky)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		// adding some heat
		life.current.police.heat = config.GAME.police.heat_cap / 2;
		life = police.startEncounter(life);
	});

	it("encounter should go into discovery mode", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("discovery");
		return done();
	});

	it("encounter should explain what is happening", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.message.simple).to.be.a("string");
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.discovery.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.discovery.full);
		return done();
	});

	it("encounter should present choices", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.choices.length).to.be.at.least(4);
		return done();
	});

	it("encounter should be lucky for the player", (done) => {
		life.current.police.meta_player = "lucky";
		life.current.police.meta_police = "unlucky";
		expect(life.current.police.meta_player).to.equal("lucky");
		expect(life.current.police.meta_police).to.equal("unlucky");
		return done();
	});

	it("encounter should accept the 'fight' action", (done) => {
		// simulate the encounter
		life = simulateAction("fight", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'detained'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("detained");
		return done();
	});

	it("encounter reason should be 'fight_success'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("fight_success");
		return done();
	});

	it("encounter should not affect player health", (done) => {
		const newHealth = config.GAME.person.starting_hp;
		expect(life.current.health.points).to.equal(newHealth);
		return done();
	});

	it("encounter should reduce police health", (done) => {
		const newDamage = config.GAME.police.base_damage;
		const newHealth = (config.GAME.person.starting_hp * life.current.police.encounter.officers) - newDamage;
		expect(life.current.police.encounter.total_hp).to.equal(newHealth);
		return done();
	});
});

function simulateAction(action, lifeObj) {
	// set our action
	lifeObj.current.police.encounter.action = action;
	// simulate the encounter
	return police.simulateEncounter(lifeObj);
}
