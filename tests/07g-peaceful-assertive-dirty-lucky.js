"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const police = main.police;
const policeJSON = main.policeJSON;

let life;

describe("Police - Simulating Encounter (Peaceful, Assertive, Dirty, Lucky)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		// adding some heat
		life.current.police.heat = config.GAME.police.heat_cap / 2;
		life.current.storage.available = 0;
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

	it("encounter should accept the 'deny_search' action", (done) => {
		// simulate the encounter
		life = simulateAction("deny_search", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'investigation'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("investigation");
		return done();
	});

	it("encounter should start 'investigation' mode", (done) => {
		// simulate the encounter
		life = police.simulateEncounter(life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("investigation");
		return done();
	});

	it("encounter should explain what is happening", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.message.simple).to.be.a("string");
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.investigation.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.investigation.full);
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

	it("encounter should accept the 'deny_guilt' action", (done) => {
		// simulate the encounter
		life = simulateAction("deny_guilt", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'end'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("end");
		return done();
	});

	it("encounter reason should be 'investigation_failure'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("investigation_failure");
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
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.investigation_failure.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.investigation_failure.full);
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
