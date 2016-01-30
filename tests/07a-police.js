"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const police = main.police;
const policeJSON = main.policeJSON;

let life;

describe("Police - Starting State", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("current police state should match config values", (done) => {
		const policeObj = life.current.police;
		// heat
		expect(policeObj.heat).to.be.a("number");
		expect(policeObj.heat).to.equal(config.GAME.police.starting_heat);
		// rate
		expect(policeObj.rate).to.be.a("number");
		expect(policeObj.rate).to.equal(config.GAME.police.heat_rate);
		// awareness
		expect(policeObj.awareness).to.be.an("object");
		// current awareness value
		expect(policeObj.awareness).to.have.property(life.current.location.country);
		expect(policeObj.awareness[life.current.location.country]).to.be.a("number");
		expect(policeObj.awareness[life.current.location.country]).to.equal(config.GAME.police.starting_heat);
		// encounter
		expect(policeObj.encounter).to.be.a("null");
		// history
		expect(policeObj.history).to.be.an("array");
		expect(policeObj.history.length).to.equal(0);
		return done();
	});
});

describe("Police - Creating Encounter", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		// adding some heat
		life.current.police.heat = config.GAME.police.heat_cap / 2;
		life = police.startEncounter(life);
	});

	it("current encounter should have officers", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.officers).to.be.at.least(1);
		expect(policeObj.encounter.officers).to.be.at.most(config.GAME.police.total_officers);
		return done();
	});

	it("current encounter should have correct officer hp", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter.total_hp).to.be.at.least(config.GAME.person.starting_hp);
		expect(policeObj.encounter.total_hp).to.equal(policeObj.encounter.officers * config.GAME.person.starting_hp);
		return done();
	});

	it("current encounter should have a message", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter).to.have.property("message");
		expect(policeObj.encounter.message).to.be.an("object");
		expect(policeObj.encounter.message.full).to.be.a("string");
		expect(policeObj.encounter.message.simple).to.be.a("string");
		return done();
	});

	it("current encounter should have choices", (done) => {
		const policeObj = life.current.police;
		expect(policeObj.encounter).to.have.property("choices");
		expect(policeObj.encounter.choices).to.be.an("array");
		return done();
	});
});
