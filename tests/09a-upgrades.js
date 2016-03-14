"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const upgrades = main.upgrades;

let life;
let upgradeObj;
describe("Upgrades - Starting State", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		upgradeObj = life.current.upgrades;
	});

	it("upgrades object should exist and be an object", (done) => {
		expect(upgradeObj).to.be.a("object");
		return done();
	});
});
