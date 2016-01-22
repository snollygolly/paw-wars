"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const bank = main.bank;

let life;

describe("Bank - Finance Validation", () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
	});

	it("current finances should match config values", (done) => {
		// cash
		expect(life.current.finance.cash).to.equal(config.GAME.bank.starting_cash);
		// debt
		expect(life.current.finance.debt).to.equal(config.GAME.bank.starting_debt);
		// savings
		expect(life.current.finance.savings).to.equal(config.GAME.bank.starting_savings);
		// debt interest
		expect(life.current.finance.debt_interest).to.equal(config.GAME.bank.debt_interest);
		// savings interest
		expect(life.current.finance.savings_interest).to.equal(config.GAME.bank.savings_interest);
		return done();
	});
});

describe("Bank - Transaction Validation (Deposit)", () => {
	let oldLife;
	let transaction;
	let newLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));

		transaction = makeTransaction("deposit");
		newLife = bank.doBankTransaction(oldLife, transaction);
	});

	it("bank should accept deposit", (done) => {
		// check for errors
		expect(newLife).to.not.have.property("error");
		return done();
	});

	it("bank should update the player cash", (done) => {
		// set up
		const newCash = Math.round(oldLife.current.finance.cash - config.AMOUNT);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.cash).to.be.a("number");
		expect(newLife.current.finance.cash).to.be.at.least(0);
		expect(newLife.current.finance.cash).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
		return done();
	});

	it("bank should update the player savings", (done) => {
		// set up
		const newCash = Math.round(oldLife.current.finance.savings + config.AMOUNT);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.savings).to.be.a("number");
		expect(newLife.current.finance.savings).to.be.at.least(0);
		expect(newLife.current.finance.savings).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.savings)).to.be.true;
		return done();
	});

	it("bank should update the player actions", (done) => {
		// set up
		const newAction = newLife.actions.pop();
		// make sure the listing updated after the buy
		// turn
		expect(newAction).to.have.property("turn");
		expect(newAction.turn).to.be.a("number");
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property("type");
		expect(newAction.type).to.equal("bank");
		// data
		expect(newAction).to.have.property("data");
		expect(newAction.data).to.be.an("object");
		expect(newAction.data).to.equal(transaction);
		return done();
	});
});

describe("Bank - Transaction Validation (Withdraw)", () => {
	let oldLife;
	let transaction;
	let newLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));

		// start to set up a buy transaction first
		transaction = makeTransaction("deposit");
		oldLife = bank.doBankTransaction(life, transaction);
		transaction = makeTransaction("withdraw");
		newLife = bank.doBankTransaction(oldLife, transaction);
	});

	it("bank should allow withdraw", (done) => {
		// check for errors
		expect(newLife).to.not.have.property("error");
		return done();
	});

	it("bank should update the player cash", (done) => {
		// set up
		const newCash = Math.round(oldLife.current.finance.cash + config.AMOUNT);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.cash).to.be.a("number");
		expect(newLife.current.finance.cash).to.be.at.least(0);
		expect(newLife.current.finance.cash).to.equal(newCash);
		expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
		return done();
	});

	it("bank should update the player savings", (done) => {
		// set up
		const newSavings = Math.round(oldLife.current.finance.savings - config.AMOUNT);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.savings).to.be.a("number");
		expect(newLife.current.finance.savings).to.be.at.least(0);
		expect(newLife.current.finance.savings).to.equal(newSavings);
		expect(common.isWholeNumber(newLife.current.finance.savings)).to.be.true;
		return done();
	});

	it("bank should update the player actions", (done) => {
		// set up
		const newAction = newLife.actions.pop();
		// make sure the listing updated after the buy
		// turn
		expect(newAction).to.have.property("turn");
		expect(newAction.turn).to.be.a("number");
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property("type");
		expect(newAction.type).to.equal("bank");
		// data
		expect(newAction).to.have.property("data");
		expect(newAction.data).to.be.an("object");
		expect(newAction.data).to.equal(transaction);
		return done();
	});
});

describe("Bank - Lending Validation (Repay)", () => {
	let oldLife;
	let transaction;
	let newLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));

		// start to set up a buy transaction first
		transaction = makeTransaction("deposit");
		oldLife = bank.doBankTransaction(life, transaction);
		transaction = makeTransaction("repay");
		newLife = bank.doBankLending(oldLife, transaction);
	});

	it("bank should allow repay", (done) => {
		// check for errors
		expect(newLife).to.not.have.property("error");
		return done();
	});

	it("bank should update the player debt", (done) => {
		// set up
		const newDebt = Math.round(oldLife.current.finance.debt - config.AMOUNT);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.debt).to.be.a("number");
		expect(newLife.current.finance.debt).to.be.at.least(0);
		expect(newLife.current.finance.debt).to.equal(newDebt);
		expect(common.isWholeNumber(newLife.current.finance.debt)).to.be.true;
		return done();
	});

	it("bank should update the player savings", (done) => {
		// set up
		const newSavings = Math.round(oldLife.current.finance.savings - config.AMOUNT);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.savings).to.be.a("number");
		expect(newLife.current.finance.savings).to.be.at.least(0);
		expect(newLife.current.finance.savings).to.equal(newSavings);
		expect(common.isWholeNumber(newLife.current.finance.savings)).to.be.true;
		return done();
	});

	it("bank should update the player actions", (done) => {
		// set up
		const newAction = newLife.actions.pop();
		// make sure the listing updated after the buy
		// turn
		expect(newAction).to.have.property("turn");
		expect(newAction.turn).to.be.a("number");
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property("type");
		expect(newAction.type).to.equal("bank");
		// data
		expect(newAction).to.have.property("data");
		expect(newAction.data).to.be.an("object");
		expect(newAction.data).to.equal(transaction);
		return done();
	});
});

describe("Bank - Lending Validation (Borrow)", () => {
	let oldLife;
	let transaction;
	let newLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));

		transaction = makeTransaction("borrow");
		newLife = bank.doBankLending(oldLife, transaction);
	});

	it("bank should allow borrow", (done) => {
		// check for errors
		expect(newLife).to.not.have.property("error");
		return done();
	});

	it("bank should update the player debt", (done) => {
		// set up
		const newDebt = Math.round(oldLife.current.finance.debt + config.AMOUNT);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.debt).to.be.a("number");
		expect(newLife.current.finance.debt).to.be.at.least(0);
		expect(newLife.current.finance.debt).to.equal(newDebt);
		expect(common.isWholeNumber(newLife.current.finance.debt)).to.be.true;
		return done();
	});

	it("bank should update the player savings", (done) => {
		// set up
		const newSavings = Math.round(oldLife.current.finance.savings + config.AMOUNT);
		// make sure the cash updated after the buy
		expect(newLife.current.finance.savings).to.be.a("number");
		expect(newLife.current.finance.savings).to.be.at.least(0);
		expect(newLife.current.finance.savings).to.equal(newSavings);
		expect(common.isWholeNumber(newLife.current.finance.savings)).to.be.true;
		return done();
	});

	it("bank should update the player actions", (done) => {
		// set up
		const newAction = newLife.actions.pop();
		// make sure the listing updated after the buy
		// turn
		expect(newAction).to.have.property("turn");
		expect(newAction.turn).to.be.a("number");
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property("type");
		expect(newAction.type).to.equal("bank");
		// data
		expect(newAction).to.have.property("data");
		expect(newAction.data).to.be.an("object");
		expect(newAction.data).to.equal(transaction);
		return done();
	});
});

function makeTransaction(type) {
	return {
		id: config.PLAYER.id,
		type: type,
		amount: config.AMOUNT
	};
}
