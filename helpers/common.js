"use strict";

module.exports.getRandomInt = function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.getRandomArbitrary = function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
