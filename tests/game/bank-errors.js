'use strict';

const expect = require('chai').expect;

const main = require('../main');
const config = main.config
const common = main.common;

const bank = main.bank;

module.exports.describeBankDepositErrors = function describeBankDepositErrors(life) {
  const oldLife = JSON.parse(JSON.stringify(life));

  it('bank should refuse deposit if not enough cash', function refuseDeposit(done) {
    let transaction = module.exports.makeTransaction("deposit");
    transaction.amount += config.GAME.bank.starting_cash;
    oldLife.current.finance.cash = 1;
    let newLife = bank.doBankTransaction(oldLife, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });
}

module.exports.describeBankWithdrawErrors = function describeBankWithdrawErrors(life) {
  const oldLife = JSON.parse(JSON.stringify(life));

  it('bank should refuse withdraw if not enough savings', function refuseWithdraw(done) {
    let transaction = module.exports.makeTransaction("withdraw");
    transaction.amount += config.GAME.bank.starting_cash;
    oldLife.current.finance.savings = 1;
    let newLife = bank.doBankTransaction(oldLife, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });
}

module.exports.describeBankRepayErrors = function describeBankRepayErrors(life) {
  const oldLife = JSON.parse(JSON.stringify(life));

  it('bank should refuse deposit if not enough debt', function refuseRepay(done) {
    let transaction = module.exports.makeTransaction("repay");
    oldLife.current.finance.debt = 1;
    let newLife = bank.doBankLending(oldLife, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });

  it('bank should refuse deposit if not enough cash', function refuseRepay(done) {
    let transaction = module.exports.makeTransaction("repay");
    transaction.amount += config.GAME.bank.starting_cash;
    oldLife.current.finance.cash = 1;
    let newLife = bank.doBankLending(oldLife, transaction);
    // check for errors
    expect(newLife).to.have.property('error');
    return done();
  });
}

module.exports.describeBankBorrowErrors = function describeBankBorrowErrors(life) {
  const oldLife = JSON.parse(JSON.stringify(life));

  it('bank should never refuse borrow', function refuseWithdraw(done) {
    let transaction = module.exports.makeTransaction("borrow");
    transaction.amount += config.GAME.bank.starting_cash;
    oldLife.current.finance.cash = 1;
    let newLife = bank.doBankLending(oldLife, transaction);
    // check for errors
    expect(newLife).to.not.have.property('error');
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
