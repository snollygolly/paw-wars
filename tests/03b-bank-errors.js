'use strict';

const expect = require('chai').expect;

const main = require('./00-main');
const config = main.config
const common = main.common;
const model = main.model;

const bank = main.bank;

let life;

describe('Bank - Transaction Error Validation (Deposit)', () => {
	let oldLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
  });

	it('bank should refuse deposit if not enough cash', function refuseDeposit(done) {
    let transaction = makeTransaction("deposit");
    transaction.amount += config.GAME.bank.starting_cash;
    oldLife.current.finance.cash = 1;
    let newLife = bank.doBankTransaction(oldLife, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });
});

describe('Bank - Transaction Error Validation (Withdraw)', () => {
	let oldLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
  });

  it('bank should refuse withdraw if not enough savings', function refuseWithdraw(done) {
    let transaction = makeTransaction("withdraw");
    transaction.amount += 10;
    oldLife.current.finance.savings = 1;
    let newLife = bank.doBankTransaction(oldLife, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });
});

describe('Bank - Transaction Error Validation (Repay)', () => {
	let oldLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		let transaction = makeTransaction("deposit");
		oldLife = bank.doBankTransaction(oldLife, transaction);
  });

	it('bank should refuse deposit if not enough debt', function refuseRepay(done) {
    let transaction = makeTransaction("repay");
		transaction.amount = 10;
    oldLife.current.finance.debt = 1;
    let newLife = bank.doBankLending(oldLife, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });

  it('bank should refuse deposit if not enough cash', function refuseRepay(done) {
    let transaction = makeTransaction("repay");
		transaction.amount = 10;
		oldLife.current.finance.debt = config.GAME.bank.starting_cash;
    oldLife.current.finance.savings = 1;
    let newLife = bank.doBankLending(oldLife, transaction);
		console.log(newLife);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });
});

describe('Bank - Transaction Error Validation (Borrow)', () => {
	let oldLife;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
  });

	it('bank should never refuse borrow', function refuseWithdraw(done) {
    let transaction = makeTransaction("borrow");
    transaction.amount += config.GAME.bank.starting_cash;
    oldLife.current.finance.cash = 1;
    let newLife = bank.doBankLending(oldLife, transaction);
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });
});

function makeTransaction(type){
  return {
		id: config.PLAYER.id,
		type: type,
		amount: config.AMOUNT
	};
}
