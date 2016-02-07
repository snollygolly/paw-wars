"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const police = main.police;
const policeJSON = main.policeJSON;

let life;

describe("Police - Simulating Encounter (Peaceful, Mixed, Dirty)", () => {
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

	it("encounter should update the player heat", (done) => {
		// set up
		const newHeat = life.current.police.heat + config.GAME.police.heat_rate;
		// make sure the cash updated after the buy
		expect(life.current.police.heat).to.be.a("number");
		expect(life.current.police.heat).to.be.at.least(0);
		expect(life.current.police.heat).to.equal(newHeat);
		expect(common.isWholeNumber(life.current.police.heat)).to.be.true;
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

	it("encounter should accept the 'admit_guilt' action", (done) => {
		// simulate the encounter
		life = simulateAction("admit_guilt", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter mode should be 'detained'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("detained");
		return done();
	});

	it("encounter reason should be 'admit_guilt'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("admit_guilt");
		return done();
	});

	it("encounter should start 'detained' mode", (done) => {
		// simulate the encounter
		life = police.simulateEncounter(life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("detained");
		return done();
	});

	it("encounter should explain what is happening", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.message.simple).to.be.a("string");
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.admit_guilt.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.admit_guilt.full);
		return done();
	});

	it("encounter should present choices", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.choices.length).to.be.at.least(4);
		return done();
	});

	it("encounter should accept the 'comply_detain' action", (done) => {
		// simulate the encounter
		life = simulateAction("comply_detain", life);
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.be.a("string");
		return done();
	});

	it("encounter should update the player heat", (done) => {
		// set up
		const newHeat = life.current.police.heat + config.GAME.police.heat_rate;
		// make sure the cash updated after the buy
		expect(life.current.police.heat).to.be.a("number");
		expect(life.current.police.heat).to.be.at.least(0);
		expect(life.current.police.heat).to.equal(newHeat);
		expect(common.isWholeNumber(life.current.police.heat)).to.be.true;
		return done();
	});

	it("encounter mode should be 'end'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.mode).to.equal("end");
		return done();
	});

	it("encounter reason should be 'comply_detain'", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.reason).to.equal("comply_detain");
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
		expect(policeObj.encounter.message.simple).to.equal(policeJSON.messages.comply_detain.simple);
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.full).to.equal(policeJSON.messages.comply_detain.full);
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
