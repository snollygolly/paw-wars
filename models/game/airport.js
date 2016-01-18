"use strict";

const game = require('../../game.json');
const places = require('./places.json');
const common = require('../../helpers/common');
const model = require('../game_life.js');

module.exports.doAirportFly = function* doAirportFly(id, flight){
  let life = yield model.getLife(id);
  // start to error check the transactions
  // first, see what they want to do, and see if the units are available
  let listing = common.getObjFromID(flight.destination, life.listings.airport);
  let location = common.getObjFromID(flight.destination, places);
  if (listing === false){
    // they choose a bad destination
    return {error: true, message: "Flight to invalid destination"};
  }
  // figure out the total price
  let totalPrice = listing.price;
  // check their money (keep in mind, savings doesn't count. dealers don't take checks)
  if (totalPrice > life.current.finance.cash){
    return {error: true, message: "Flight costs more than life can afford"};
  }
  // adjust the user's money
  life.current.finance.cash = life.current.finance.cash - totalPrice;
  // adjust their location
  life.current.location = location;
  // build the life action
  life.actions.push({
    turn: life.current.turn,
    type: "airport",
    data: listing
  });
  // adjust the turn
  life.current.turn += listing.flight_time;
  life = model.changeTurn(life, life.current.turn);
  // save the new life
  life = yield model.replaceLife(life);
  //console.log("* doAirportFly:", life);
  return life;
}

module.exports.generateAirportListings = function generateAirportListings(life){
  // generates prices for the airport
  // loop through each items to set prices and qty
  let priceArr = [];
  let location = life.current.location;
	for (let place of places){
    let priceObj = {
      id: place.id,
      size: place.size
    };
		priceObj.flight_number = generateFlightNumber();
		// generate price for flights
		// TODO: factor in continents into pricing and probably travel time
    // generate a multiplier for how much size affects price
    let multi = (1 - (priceObj.size / game.airport.size_max)) * game.airport.size_affect;
    // take whatever the min is, take the abs (we don't want negative numbers), multi the multiplier
    let priceFloor = multi * Math.abs(game.airport.price_variance.min);
    // use this to boost the base price of all price generation (larger size = less price)
		let priceVariance = common.getRandomArbitrary(game.airport.price_variance.min + priceFloor, game.airport.price_variance.max + priceFloor);
		priceObj.price = Math.round((game.airport.base_price * priceVariance) + game.airport.base_price);
		// generate flight time
		priceObj.flight_time = findFlightTime(location, place)
    priceArr.push(priceObj);
	}
  return priceArr;

  function generateFlightNumber(){
  	// generates a believable flight number randomly
  	let flightNumber = '';
  	let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  	// see how long each segment is
  	let letterSeg = common.getRandomInt(2,3);
  	let numberSeg = common.getRandomInt(3,4);
  	for (let i=0; i < letterSeg; i++){
  		flightNumber += alphabet.charAt(common.getRandomInt(0, alphabet.length));
  	}
  	for (let i=0; i < numberSeg; i++){
  		flightNumber += String(common.getRandomInt(0, 9));
  	}
  	return flightNumber;
  }

  function findFlightTime(current, future){
  	let flightTime = 0;
    if (current.city != future.city){flightTime++;}
  	if (current.country != future.country){flightTime++;}
  	if (current.continent != future.continent){flightTime++;}
  	return flightTime;
  }
}
