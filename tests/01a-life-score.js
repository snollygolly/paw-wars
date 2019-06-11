"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

let life;
let score;

describe("Life Model - Score (Starting)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		score = model.getScore(life);
	});

	it("score should be the correct type", (done) => {
		expect(score).to.be.a("number");
		return done();
	});

	it("score should be correct", (done) => {
		expect(score).to.equal(-1500);
		return done();
	});
});

describe("Life Model - Score (Winning)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		life.current.finance.cash = 10000;
		life.current.finance.savings = 1000000;
		life.current.turn = 50;
		score = model.getScore(life);
	});

	it("score should be the correct type", (done) => {
		expect(score).to.be.a("number");
		return done();
	});

	it("score should be correct", (done) => {
		expect(score).to.equal(1497020);
		return done();
	});
});
