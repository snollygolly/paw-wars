"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

let life;

describe("Life Model - Death (Not Dead Yet)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		life = model.checkDeath(life);
	});

	it("life should not be undefined", (done) => {
		expect(life).to.not.be.an("undefined");
		return done();
	});

	it("life should have required properties", (done) => {
		expect(life).to.be.an("object");
		expect(life).to.have.property("_id");
		expect(life).to.have.property("alive");
		expect(life).to.have.property("starting");
		expect(life).to.have.property("current");
		expect(life).to.have.property("listings");
		expect(life).to.have.property("actions");
		return done();
	});

	it("life should have a valid id", (done) => {
		expect(life._id).to.be.a("string");
		const idArr = life._id.split("_");
		expect(idArr.length).to.equal(2);
		expect(idArr[0]).to.equal(config.PLAYER._id);
		// TODO: expect().to.be.a.timestamp?
		return done();
	});

	it("life should be alive", (done) => {
		expect(life.alive).to.be.a("boolean");
		expect(life.alive).to.equal(true);
		return done();
	});
});

describe("Life Model - Death (Almost Pity Death)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		life.current.finance.cash = 0;
		life.current.finance.savings = 0;
		life = model.checkDeath(life);
	});

	it("life should not be undefined", (done) => {
		expect(life).to.not.be.an("undefined");
		return done();
	});

	it("life should have required properties", (done) => {
		expect(life).to.be.an("object");
		expect(life).to.have.property("_id");
		expect(life).to.have.property("alive");
		expect(life).to.have.property("starting");
		expect(life).to.have.property("current");
		expect(life).to.have.property("listings");
		expect(life).to.have.property("actions");
		return done();
	});

	it("life should have a valid id", (done) => {
		expect(life._id).to.be.a("string");
		const idArr = life._id.split("_");
		expect(idArr.length).to.equal(2);
		expect(idArr[0]).to.equal(config.PLAYER._id);
		// TODO: expect().to.be.a.timestamp?
		return done();
	});

	it("life should be alive", (done) => {
		expect(life.alive).to.be.a("boolean");
		expect(life.alive).to.equal(true);
		return done();
	});
});

describe("Life Model - Death (Pity Death)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		life.current.finance.cash = 0;
		life.current.finance.savings = 0;
		life.current.finance.debt = config.GAME.bank.starting_debt * 5;
		life = model.checkDeath(life);
	});

	it("life should not be undefined", (done) => {
		expect(life).to.not.be.an("undefined");
		return done();
	});

	it("life should have required properties", (done) => {
		expect(life).to.be.an("object");
		expect(life).to.have.property("_id");
		expect(life).to.have.property("alive");
		expect(life).to.have.property("starting");
		expect(life).to.have.property("current");
		expect(life).to.have.property("listings");
		expect(life).to.have.property("actions");
		expect(life).to.have.property("eulogy");
		return done();
	});

	it("life should have a valid id", (done) => {
		expect(life._id).to.be.a("string");
		const idArr = life._id.split("_");
		expect(idArr.length).to.equal(2);
		expect(idArr[0]).to.equal(config.PLAYER._id);
		// TODO: expect().to.be.a.timestamp?
		return done();
	});

	it("life should be dead", (done) => {
		expect(life.alive).to.be.a("boolean");
		expect(life.alive).to.equal(false);
		return done();
	});

	it("eulogy should be beautiful", (done) => {
		expect(life.eulogy).to.equal(main.deathsJSON.bankrupt);
		return done();
	});
});

describe("Life Model - Death (Dead Death)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		life.current.health.points = 0;
		life = model.checkDeath(life);
	});

	it("life should not be undefined", (done) => {
		expect(life).to.not.be.an("undefined");
		return done();
	});

	it("life should have required properties", (done) => {
		expect(life).to.be.an("object");
		expect(life).to.have.property("_id");
		expect(life).to.have.property("alive");
		expect(life).to.have.property("starting");
		expect(life).to.have.property("current");
		expect(life).to.have.property("listings");
		expect(life).to.have.property("actions");
		expect(life).to.have.property("eulogy");
		return done();
	});

	it("life should have a valid id", (done) => {
		expect(life._id).to.be.a("string");
		const idArr = life._id.split("_");
		expect(idArr.length).to.equal(2);
		expect(idArr[0]).to.equal(config.PLAYER._id);
		// TODO: expect().to.be.a.timestamp?
		return done();
	});

	it("life should be dead", (done) => {
		expect(life.alive).to.be.a("boolean");
		expect(life.alive).to.equal(false);
		return done();
	});

	it("eulogy should be beautiful", (done) => {
		expect(life.eulogy).to.equal(main.deathsJSON.dead);
		return done();
	});
});

describe("Life Model - Death (Turn Death)", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
		life.current.turn = 999;
		life = model.checkDeath(life);
	});

	it("life should not be undefined", (done) => {
		expect(life).to.not.be.an("undefined");
		return done();
	});

	it("life should have required properties", (done) => {
		expect(life).to.be.an("object");
		expect(life).to.have.property("_id");
		expect(life).to.have.property("alive");
		expect(life).to.have.property("starting");
		expect(life).to.have.property("current");
		expect(life).to.have.property("listings");
		expect(life).to.have.property("actions");
		expect(life).to.have.property("eulogy");
		return done();
	});

	it("life should have a valid id", (done) => {
		expect(life._id).to.be.a("string");
		const idArr = life._id.split("_");
		expect(idArr.length).to.equal(2);
		expect(idArr[0]).to.equal(config.PLAYER._id);
		// TODO: expect().to.be.a.timestamp?
		return done();
	});

	it("life should be dead", (done) => {
		expect(life.alive).to.be.a("boolean");
		expect(life.alive).to.equal(false);
		return done();
	});

	it("eulogy should be beautiful", (done) => {
		expect(life.eulogy).to.equal(main.deathsJSON.old_age);
		return done();
	});
});
