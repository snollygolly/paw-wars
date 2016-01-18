'use strict';

const expect = require('chai').expect;

const main = require('../main');
const config = main.config
const common = main.common;

const bank = main.bank;

module.exports.describeFinanceValidation = function describeFinanceValidation(life) {
  it('current finances should match config values', function hasValidFinance(done) {
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
}

module.exports.describeDepositTransactionValidation = function describeDepositTransactionValidation(life) {
  const oldLife = JSON.parse(JSON.stringify(life));
  let transaction = module.exports.makeTransaction("deposit");
  let newLife = bank.doBankTransaction(life, transaction);

  it('bank should accept deposit', function bankDeposit(done) {
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('bank should update the player cash', function bankTransactionCash(done) {
    // set up
    let newCash = Math.round(oldLife.current.finance.cash - config.AMOUNT);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.cash).to.be.a('number');
    expect(newLife.current.finance.cash).to.be.at.least(0);
    expect(newLife.current.finance.cash).to.equal(newCash);
    expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
    return done();
  });

  it('bank should update the player savings', function bankTransactionSavings(done) {
    // set up
    let newCash = Math.round(oldLife.current.finance.savings + config.AMOUNT);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.savings).to.be.a('number');
    expect(newLife.current.finance.savings).to.be.at.least(0);
    expect(newLife.current.finance.savings).to.equal(newCash);
    expect(common.isWholeNumber(newLife.current.finance.savings)).to.be.true;
    return done();
  });

  it('bank should update the player actions', function bankTransactionActions(done) {
    // set up
    let newAction = newLife.actions.pop();
    // make sure the listing updated after the buy
    // turn
    expect(newAction).to.have.property('turn');
    expect(newAction.turn).to.be.a('number');
    expect(newAction.turn).to.equal(oldLife.current.turn);
    // type
    expect(newAction).to.have.property('type');
    expect(newAction.type).to.equal('bank');
    // data
    expect(newAction).to.have.property('data');
    expect(newAction.data).to.be.an('object');
    expect(newAction.data).to.equal(transaction);
    return done();
  });
}

module.exports.describeWithdrawTransactionValidation = function describeWithdrawTransactionValidation(life) {
  const oldLife = JSON.parse(JSON.stringify(life));
  let transaction = module.exports.makeTransaction("withdraw");
  let newLife = bank.doBankTransaction(life, transaction);
  it('bank should allow withdraw', function bankWithdraw(done) {
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('bank should update the player cash', function bankTransactionCash(done) {
    // set up
    let newCash = Math.round(oldLife.current.finance.cash + config.AMOUNT);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.cash).to.be.a('number');
    expect(newLife.current.finance.cash).to.be.at.least(0);
    expect(newLife.current.finance.cash).to.equal(newCash);
    expect(common.isWholeNumber(newLife.current.finance.cash)).to.be.true;
    return done();
  });

  it('bank should update the player savings', function bankTransactionSavings(done) {
    // set up
    let newSavings = Math.round(oldLife.current.finance.savings - config.AMOUNT);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.savings).to.be.a('number');
    expect(newLife.current.finance.savings).to.be.at.least(0);
    expect(newLife.current.finance.savings).to.equal(newSavings);
    expect(common.isWholeNumber(newLife.current.finance.savings)).to.be.true;
    return done();
  });

  it('bank should update the player actions', function bankTransactionActions(done) {
    // set up
    let newAction = newLife.actions.pop();
    // make sure the listing updated after the buy
    // turn
    expect(newAction).to.have.property('turn');
    expect(newAction.turn).to.be.a('number');
    expect(newAction.turn).to.equal(oldLife.current.turn);
    // type
    expect(newAction).to.have.property('type');
    expect(newAction.type).to.equal('bank');
    // data
    expect(newAction).to.have.property('data');
    expect(newAction.data).to.be.an('object');
    expect(newAction.data).to.equal(transaction);
    return done();
  });
}

module.exports.describeRepayLendingValidation = function describeRepayLendingValidation(life) {
  const oldLife = JSON.parse(JSON.stringify(life));
  let transaction = module.exports.makeTransaction("repay");
  let newLife = bank.doBankLending(life, transaction);
  it('bank should allow repay', function bankRepay(done) {
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('bank should update the player debt', function bankTransactionDebt(done) {
    // set up
    let newDebt = Math.round(oldLife.current.finance.debt - config.AMOUNT);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.debt).to.be.a('number');
    expect(newLife.current.finance.debt).to.be.at.least(0);
    expect(newLife.current.finance.debt).to.equal(newDebt);
    expect(common.isWholeNumber(newLife.current.finance.debt)).to.be.true;
    return done();
  });

  it('bank should update the player savings', function bankTransactionSavings(done) {
    // set up
    let newSavings = Math.round(oldLife.current.finance.savings - config.AMOUNT);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.savings).to.be.a('number');
    expect(newLife.current.finance.savings).to.be.at.least(0);
    expect(newLife.current.finance.savings).to.equal(newSavings);
    expect(common.isWholeNumber(newLife.current.finance.savings)).to.be.true;
    return done();
  });

  it('bank should update the player actions', function bankTransactionActions(done) {
    // set up
    let newAction = newLife.actions.pop();
    // make sure the listing updated after the buy
    // turn
    expect(newAction).to.have.property('turn');
    expect(newAction.turn).to.be.a('number');
    expect(newAction.turn).to.equal(oldLife.current.turn);
    // type
    expect(newAction).to.have.property('type');
    expect(newAction.type).to.equal('bank');
    // data
    expect(newAction).to.have.property('data');
    expect(newAction.data).to.be.an('object');
    expect(newAction.data).to.equal(transaction);
    return done();
  });
}

module.exports.describeBorrowLendingValidation = function describeBorrowLendingValidation(life) {
  const oldLife = JSON.parse(JSON.stringify(life));
  let transaction = module.exports.makeTransaction("borrow");
  let newLife = bank.doBankLending(life, transaction);
  it('bank should allow borrow', function bankRepay(done) {
    // check for errors
    expect(newLife).to.not.have.property('error');
    return done();
  });

  it('bank should update the player debt', function bankTransactionDebt(done) {
    // set up
    let newDebt = Math.round(oldLife.current.finance.debt + config.AMOUNT);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.debt).to.be.a('number');
    expect(newLife.current.finance.debt).to.be.at.least(0);
    expect(newLife.current.finance.debt).to.equal(newDebt);
    expect(common.isWholeNumber(newLife.current.finance.debt)).to.be.true;
    return done();
  });

  it('bank should update the player savings', function bankTransactionSavings(done) {
    // set up
    let newSavings = Math.round(oldLife.current.finance.savings + config.AMOUNT);
    // make sure the cash updated after the buy
    expect(newLife.current.finance.savings).to.be.a('number');
    expect(newLife.current.finance.savings).to.be.at.least(0);
    expect(newLife.current.finance.savings).to.equal(newSavings);
    expect(common.isWholeNumber(newLife.current.finance.savings)).to.be.true;
    return done();
  });

  it('bank should update the player actions', function bankTransactionActions(done) {
    // set up
    let newAction = newLife.actions.pop();
    // make sure the listing updated after the buy
    // turn
    expect(newAction).to.have.property('turn');
    expect(newAction.turn).to.be.a('number');
    expect(newAction.turn).to.equal(oldLife.current.turn);
    // type
    expect(newAction).to.have.property('type');
    expect(newAction.type).to.equal('bank');
    // data
    expect(newAction).to.have.property('data');
    expect(newAction.data).to.be.an('object');
    expect(newAction.data).to.equal(transaction);
    return done();
  });
}

module.exports.makeTransaction = function makeTransaction(type){
  return {
		id: config.PLAYER.id,
		type: type,
		amount: config.AMOUNT
	};
}
