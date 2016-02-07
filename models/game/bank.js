"use strict";

const common = require("../../helpers/common");
const model = require("../game_life.js");

module.exports.saveBankTransaction = function* saveBankTransaction(id, transaction) {
	// get the latest copy from the database
	let life = yield model.getLife(id);
	// run all the transaction logic against it and get it back
	life = module.exports.doBankTransaction(life, transaction);
	// check for errors
	if (life.error === true) {
		// exit early
		return life;
	}
	// now replace it in the DB
	life = yield model.replaceLife(life);
	return life;
};

module.exports.doBankTransaction = function doBankTransaction(life, transaction) {
	const newLife = JSON.parse(JSON.stringify(life));
	// NOTE: transaction is provided as a int, no need to parse
	// start to error check the transactions
	if (transaction.type == "withdraw") {
		// if this is a withdraw, make it a negative number
		transaction.amount *= -1;
	}
	// just do the math and see if it's possible after
	newLife.current.finance.savings += transaction.amount;
	newLife.current.finance.cash -= transaction.amount;
	if (newLife.current.finance.cash < 0) {
		return {error: true, message: "Insufficient cash"};
	}
	if (newLife.current.finance.savings < 0) {
		return {error: true, message: "Insufficient savings"};
	}
	// build the life action
	newLife.actions.push({
		turn: life.current.turn,
		type: "bank",
		data: transaction
	});
	// console.log("* doBankTransaction:", newLife);
	return newLife;
};

module.exports.saveBankLending = function* saveBankLending(id, transaction) {
	// get the latest copy from the database
	let life = yield model.getLife(id);
	// run all the transaction logic against it and get it back
	life = module.exports.doBankLending(life, transaction);
	// check for errors
	if (life.error === true) {
		// exit early
		return life;
	}
	// now replace it in the DB
	life = yield model.replaceLife(life);
	return life;
};

module.exports.doBankLending = function doBankLending(life, transaction) {
	const newLife = JSON.parse(JSON.stringify(life));
	// NOTE: transaction is provided as an it, no need to parse
	// start to error check the transactions
	if (transaction.type == "borrow") {
		// if this is a withdraw, make it a negative number
		transaction.amount *= -1;
	}
	// just do the math and see if it's possible after
	newLife.current.finance.savings -= transaction.amount;
	newLife.current.finance.debt -= transaction.amount;
	if (newLife.current.finance.debt < 0) {
		return {error: true, message: "Overpayment on loan"};
	}
	if (newLife.current.finance.savings < 0) {
		return {error: true, message: "Insufficient savings"};
	}
	// build the life action
	newLife.actions.push({
		turn: life.current.turn,
		type: "bank",
		data: transaction
	});
	// console.log("* doBankTransaction:", newLife);
	return newLife;
};

module.exports.handleInterest = function handleInterest(life, turns) {
	const newLife = JSON.parse(JSON.stringify(life));
	let i = 0;
	while (i < turns) {
		newLife.current.finance.debt += Math.round(newLife.current.finance.debt * newLife.current.finance.debt_interest);
		newLife.current.finance.savings += Math.round(newLife.current.finance.savings * newLife.current.finance.savings_interest);
		i++;
	}
	return newLife;
};
