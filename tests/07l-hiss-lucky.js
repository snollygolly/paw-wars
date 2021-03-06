"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const police = main.police;
const policeJSON = main.policeJSON;
const localization = main.localization;

let life;

describe("Police - Simulating Encounter (Hiss, Lucky)", () => {
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
		expect(localization("police_discovery_simple", true)).to.include(policeObj.encounter.message.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(localization("police_discovery_full", true)).to.include(policeObj.encounter.message.full);
		return done();
	});

	it("encounter should present choices", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.choices.length).to.be.at.least(4);
		return done();
	});

	it("encounter should be lucky", (done) => {
		life.current.police.meta = "lucky";
		expect(life.current.police.meta).to.equal("lucky");
		return done();
	});

	it("encounter should accept the 'hiss' action", (done) => {
		// simulate the encounter
		life = simulateAction("hiss", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'end'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("end");
		return done();
	});

	it("encounter reason should be 'hiss_success'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("hiss_success");
		return done();
	});
});

function simulateAction(action, lifeObj) {
	// set our action
	lifeObj.current.police.encounter.action = action;
	// simulate the encounter
	return police.simulateEncounter(lifeObj);
}
