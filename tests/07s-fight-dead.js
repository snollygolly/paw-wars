"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const police = main.police;
const policeJSON = main.policeJSON;

let life;

describe("Police - Simulating Encounter (Fight, Dead)", () => {
	let oldLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		// adding some heat
		life.current.police.heat = config.GAME.police.heat_cap / 2;
		// lowering the hp
		life.current.health.points = 1;
		oldLife = JSON.parse(JSON.stringify(life));
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

	it("encounter should be unlucky for the player", (done) => {
		life.current.police.meta_player = "unlucky";
		life.current.police.meta_police = "lucky";
		expect(life.current.police.meta_player).to.equal("unlucky");
		expect(life.current.police.meta_police).to.equal("lucky");
		return done();
	});

	it("encounter should accept the 'fight' action", (done) => {
		// simulate the encounter
		life = simulateAction("fight", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter should update the player heat", (done) => {
		// set up
		const newHeat = oldLife.current.police.heat + (config.GAME.police.heat_rate * 2);
		// make sure the cash updated after the buy
		expect(life.current.police.heat).to.be.a("number");
		expect(life.current.police.heat).to.be.at.least(0);
		expect(life.current.police.heat).to.equal(newHeat);
		expect(common.isWholeNumber(life.current.police.heat)).to.be.true;
		oldLife.current.police.heat += config.GAME.police.heat_rate;
		return done();
	});

	it("encounter mode should be 'end'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("end");
		return done();
	});

	it("encounter reason should be 'dead'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("dead");
		return done();
	});

	it("encounter should reduce player health", (done) => {
		const newDamage = config.GAME.police.base_damage;
		const newHealth = 1 - newDamage;
		expect(life.current.health.points).to.equal(newHealth);
		return done();
	});

	it("encounter should not affect police health", (done) => {
		const newHealth = (config.GAME.person.starting_hp * life.current.police.encounter.officers);
		expect(life.current.police.encounter.total_hp).to.equal(newHealth);
		return done();
	});

	it("encounter should start 'end' mode", (done) => {
		// simulate the encounter
		life = police.simulateEncounter(life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("end");
		return done();
	});

	it("encounter should explain what is happening", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.message.simple).to.be.a("string");
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.dead.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.dead.full);
		return done();
	});

	it("encounter should present a choice", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.choices.length).to.equal(1);
		return done();
	});

	it("encounter should accept the 'continue' action", (done) => {
		// simulate the encounter
		life = simulateAction("continue", life);
		const policeObj = life.current.police;
		expect(policeObj).to.be.an("object");
		return done();
	});

	it("encounter should be gone", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter).to.be.a("null");
		return done();
	});
});

function simulateAction(action, lifeObj) {
	// set our action
	lifeObj.current.police.encounter.action = action;
	// simulate the encounter
	return police.simulateEncounter(lifeObj);
}
