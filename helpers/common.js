"use strict";

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
