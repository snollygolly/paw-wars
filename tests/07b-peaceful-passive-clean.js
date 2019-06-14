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

describe("Police - Simulating Encounter (Peaceful, Passive, Clean)", () => {
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

	it("encounter should accept the 'allow_search' action", (done) => {
		// simulate the encounter
		life = simulateAction("permit_search", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'searching'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("searching");
		return done();
	});

	it("encounter reason should be 'search_consent'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("search_consent");
		return done();
	});

	it("encounter should start 'searching' mode", (done) => {
		// simulate the encounter
		life = police.simulateEncounter(life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("searching");
		return done();
	});

	it("encounter should explain what is happening", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.message.simple).to.be.a("string");
		expect(localization("police_search_consent_simple", true)).to.include(policeObj.encounter.message.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(localization("police_search_consent_full", true)).to.include(policeObj.encounter.message.full);
		return done();
	});

	it("encounter should present choices", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.choices.length).to.be.at.least(4);
		return done();
	});

	it("encounter should accept the 'comply_search' action", (done) => {
		// simulate the encounter
		life = simulateAction("comply_search", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'end'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("end");
		return done();
	});

	it("encounter reason should be 'search_failure'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("search_failure");
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
		expect(localization("police_search_failure_simple", true)).to.include(policeObj.encounter.message.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(localization("police_search_failure_full", true)).to.include(policeObj.encounter.message.full);
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
