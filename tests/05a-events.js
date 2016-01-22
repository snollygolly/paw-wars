"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const events = main.events;

let life;

describe("Events - Starting State", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("current event should match config values", (done) => {
		expect(life.current.event).to.equal(config.GAME.events.starting_message);
		return done();
	});
});
