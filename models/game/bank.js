"use strict";

const common = require('../../helpers/common');
const model = require('../game_life.js');

module.exports.saveBankTransaction = function* saveBankTransaction(id, transaction){
  // get the latest copy from the database
  let life = yield model.getLife(id);
  // run all the transaction logic against it and get it back
  life = module.exports.doBankTransaction(life, transaction);
  // check for errors
  if (life.error === true){
    // exit early
    return life;
  }
  // now replace it in the DB
  life = yield model.replaceLife(life);
  return life;
}

module.exports.doBankTransaction = function doBankTransaction(life, transaction){
  // NOTE: transaction is provided as a int, no need to parse
  // start to error check the transactions
  if (transaction.type == "withdraw"){
    // if this is a withdraw, make it a negative number
    transaction.amount *= -1;
  }
  // just do the math and see if it's possible after
  life.current.finance.savings += transaction.amount;
  life.current.finance.cash -= transaction.amount;
  if (life.current.finance.cash < 0){
    return {error: true, message: "Insufficient cash"};
  }
  if (life.current.finance.savings < 0){
    return {error: true, message: "Insufficient savings"};
  }
  // build the life action
  life.actions.push({
    turn: life.current.turn,
    type: "bank",
    data: transaction
  });
  //console.log("* doBankTransaction:", life);
  return life;
}

module.exports.saveBankLending = function* saveBankLending(id, transaction){
  // get the latest copy from the database
  let life = yield model.getLife(id);
  // run all the transaction logic against it and get it back
  life = module.exports.doBankLending(life, transaction);
  // check for errors
  if (life.error === true){
    // exit early
    return life;
  }
  // now replace it in the DB
  life = yield model.replaceLife(life);
  return life;
}

module.exports.doBankLending = function doBankLending(life, transaction){
  // NOTE: transaction is provided as an it, no need to parse
  // start to error check the transactions
  if (transaction.type == "borrow"){
    // if this is a withdraw, make it a negative number
    transaction.amount *= -1;
  }
  // just do the math and see if it's possible after
  life.current.finance.savings -= transaction.amount;
  life.current.finance.debt -= transaction.amount;
  if (life.current.finance.savings < 0){
    return {error: true, message: "Insufficient savings"};
  }
  if (life.current.finance.debt < 0){
    return {error: true, message: "Overpayment on loan"};
  }
  // build the life action
  life.actions.push({
    turn: life.current.turn,
    type: "bank",
    data: transaction
  });
  //console.log("* doBankTransaction:", life);
  return life;
}

module.exports.handleInterest = function handleInterest(life){
  life = chargeInterest(life);
  life = payInterest(life);
  return life

  function chargeInterest(life){
    life.current.finance.debt += Math.round(life.current.finance.debt * life.current.finance.debt_interest);
    return life;
  }

  function payInterest(life){
    life.current.finance.savings += Math.round(life.current.finance.savings * life.current.finance.savings_interest);
    return life;
  }
}
