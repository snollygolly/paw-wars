"use strict";

const config = require('../../config.json');
const common = require('../../helpers/common');
const model = require('../game_life.js');

module.exports.doBankTransaction = function* doBankTransaction(id, transaction){
  // NOTE: transaction is provided as a int, no need to parse
  let life = yield model.getLife(id);
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
  // save the new life
  life = yield model.replaceLife(life);
  //console.log("* doBankTransaction:", life);
  return life;
}

module.exports.doBankLending = function* doBankLending(id, transaction){
  // NOTE: transaction is provided as an it, no need to parse
  let life = yield model.getLife(id);
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
  // save the new life
  life = yield model.replaceLife(life);
  //console.log("* doBankTransaction:", life);
  return life;
}

module.exports.chargeInterest = function chargeInterest(life){
  life.current.finance.debt += life.current.finance.debt * (life.current.finance.interest / 100);
  return life;
}
