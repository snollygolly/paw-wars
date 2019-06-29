"use strict";

const winston = require("winston");

const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.simple()
	),
	transports: [
		new winston.transports.Console({level: "debug"}),
		new winston.transports.File({ filename: "log/error.log", level: "error" }),
		new winston.transports.File({ filename: "log/combined.log" })
	]
});

module.exports.log = (level, msg, data = null) => {
	logger.log({
		level,
		message: (data === null) ? msg : `${msg} \n[${JSON.stringify(data, null, 2)}]`
	});
};

module.exports.getRandomInt = function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.getRandomArbitrary = function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
};

module.exports.getObjFromID = function getObjFromID(id, searchArr) {
	for (const obj of searchArr) {
		if (obj.id == id) {
			return obj;
		}
	}
	return false;
};

module.exports.replaceObjFromArr = function replaceObjFromArr(obj, searchArr) {
	const returnArr = [];
	for (let searchObj of searchArr) {
		if (searchObj.id == obj.id) {
			searchObj = obj;
		}
		returnArr.push(searchObj);
	}
	return returnArr;
};

module.exports.isWholeNumber = function isWholeNumber(num) {
	if (num % 1 === 0) {
		return true;
	}
	return false;
};

module.exports.randomShrinkArr = function randomShrinkArr(arr, newSize) {
	const returnArr = arr.slice();
	while (returnArr.length > newSize) {
		returnArr.splice(module.exports.getRandomInt(0, (returnArr.length - 1)), 1);
	}
	return returnArr;
};

module.exports.shuffleArr = function shuffleArr(arr) {
	const clonedArr = JSON.parse(JSON.stringify(arr));
	let currentIndex = clonedArr.length;
	let temporaryValue;
	let randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = clonedArr[currentIndex];
		clonedArr[currentIndex] = clonedArr[randomIndex];
		clonedArr[randomIndex] = temporaryValue;
	}
	return clonedArr;
};

module.exports.rollDice = function rollDice(min, max, luck) {
	if (typeof(luck) == "undefined") {
		if (max < min) {
			// if the order is backwards, we need it that way for testing, fix it
			const newMin = max;
			const newMax = min;
			max = newMax;
			min = newMin;
		}
		luck = "none";
	}
	const luckObj = {
		"lucky": min,
		"unlucky": max,
		"none": module.exports.getRandomArbitrary(min, max)
	};
	return luckObj[luck];
};

module.exports.capitalizeWord = function capitalizeWord(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
