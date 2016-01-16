"use strict";

module.exports.getRandomInt = function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.getRandomArbitrary = function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports.getObjFromID = function getObjFromID(id, searchArr){
  for (let obj of searchArr){
    if (obj.id == id){
      return obj;
    }
  }
  return false;
}

module.exports.replaceObjFromArr = function replaceObjFromArr(obj, searchArr){
  let returnArr = [];
  for (let searchObj of searchArr){
    if (searchObj.id == obj.id){
      searchObj = obj;
    }
    returnArr.push(searchObj);
  }
  return returnArr;
}
