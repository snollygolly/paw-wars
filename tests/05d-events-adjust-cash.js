"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const events = main.events;

let life;

describe("Events - Simulation Validation (Adjust Cash)", () => {
	let oldLife;
	let newLife;
	let adjustmentAmount;
	const eventObj = {
		id: "testing",
		type: "adjust_cash",
		descriptions: [
			"This should have an amount here -> {{amount}}"
		],
		parameters: {
			amount: {
				min: 0.50,
				max: 1.50
			}
		}
	};

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		newLife = events.simulateEvents(oldLife, eventObj);
		adjustmentAmount = newLife.actions[newLife.actions.length - 1].data.amount;
	});

	it("event should accept a simulation request", (done) => {
		// check for errors
		expect(newLife).to.not.have.property("error");
		return done();
	});

	it("event should update the current event", (done) => {
		const newCash = Math.round(adjustmentAmount * config.GAME.market.base_price);
		expect(newLife.current.event).to.be.a("string");
		expect(newLife.current.event).to.equal(`This should have an amount here -> ${newCash}`);
		return done();
	});

	it("event should generate cash in the player finance", (done) => {
		// we should have more money now
		const newCash = Math.round(adjustmentAmount * config.GAME.market.base_price) + oldLife.current.finance.cash;
		expect(newLife.current.finance.cash).to.be.above(oldLife.current.finance.cash);
		expect(newLife.current.finance.cash).to.equal(newCash);
		return done();
	});

	it("event should update the player actions", (done) => {
		// set up
		const newAction = newLife.actions.pop();
		// turn
		expect(newAction).to.have.property("turn");
		expect(newAction.turn).to.be.a("number");
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property("type");
		expect(newAction.type).to.equal("event");
		// data
		expect(newAction).to.have.property("data");
		expect(newAction.data).to.be.an("object");
		// data.type
		expect(newAction.data).to.have.property("type");
		expect(newAction.data.type).to.be.a("string");
		// data.type
		expect(newAction.data).to.have.property("amount");
		expect(newAction.data.amount).to.be.a("number");
		return done();
	});
});
