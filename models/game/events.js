"use strict";

const game = require('../../game.json');
const items = require('./items.json');
const events = require('./events.json');
const common = require('../../helpers/common');
const model = require('../game_life.js');

module.exports.simulateEvents = function simulateEvents(life){
  // see if we even get an event
  let eventRoll = common.getRandomInt(0, 100);
  // see if our roll is good enough for an event
  if (game.events.event_rate <= eventRoll){
    // they didn't get an event
    life.current.event = "Nothing of interest happened this turn.";
    return life;
  }
  // pick a random number from the events
  let eventIndex = common.getRandomInt(0, (events.length - 1));
  let eventObj = events[eventIndex];
  // see what kind of event this is
  let adjustment;
  switch (eventObj.type){
    case "adjust_market":
      // start building the adjustment object
      adjustment = {
        type: eventObj.type,
        item: items[common.getRandomInt(0, (items.length - 1))],
        price: common.getRandomArbitrary(eventObj.parameters.price.min, eventObj.parameters.price.max),
        units: common.getRandomArbitrary(eventObj.parameters.units.min, eventObj.parameters.units.max)
      };
      life = adjustMarketListing(life, adjustment);
      break;
    case "adjust_inventory":
      // start building the adjustment object
      adjustment = {
        type: eventObj.type,
        item: items[common.getRandomInt(0, (items.length - 1))],
        units: common.getRandomArbitrary(eventObj.parameters.units.min, eventObj.parameters.units.max)
      };
      life = adjustCurrentInventory(life, adjustment);
      break;
    case "adjust_cash":
      // start building the adjustment object
      adjustment = {
        type: eventObj.type,
        amount: common.getRandomArbitrary(eventObj.parameters.amount.min, eventObj.parameters.amount.max)
      };
      life = adjustCurrentCash(life, adjustment);
      break;
  }
  // write the description
  life.current.event = makeDescription(eventObj, adjustment);
  // write the actions log
  life.actions.push({
    turn: life.current.turn,
    type: "event",
    data: adjustment
  })
  //console.log("* simulateEvents:", life);
  return life;
}

function makeDescription(eventObj, adjustment){
  // pick description
  let description = eventObj.descriptions[common.getRandomInt(0, (eventObj.descriptions.length - 1))];
  if (description.indexOf("{{item}}") >= 0){
    description = description.replace(/\{\{item\}\}/g, adjustment.item.name);
  }
  if (description.indexOf("{{amount}}") >= 0){
    description = description.replace(/\{\{amount\}\}/g, Math.round(adjustment.amount * game.market.base_price));
  }
  return description;
}

function adjustMarketListing(life, adjustment){
  // get the listing
  let listing = common.getObjFromID(adjustment.item.id, life.listings.market);
  // adjust the listing's stock
  listing.units = Math.round(listing.units * adjustment.units);
  // adjust the listing's price
  listing.price = Math.round(listing.price * adjustment.price);
  // insert it back into the listings
  life.listings.market = common.replaceObjFromArr(listing, life.listings.market);
  return life;
}

function adjustCurrentInventory(life, adjustment){
  // get the inventory
  let inventory = common.getObjFromID(adjustment.item.id, life.current.inventory);
  if (inventory === false){
    // we searched the inventory for this object, but didn't find it, lets make it
    inventory = {
      id: adjustment.item.id,
      units: 0
    }
    life.current.inventory.push(inventory);
  }
  let newUnits = Math.round(game.market.base_units * adjustment.units);
  if (newUnits <= life.current.storage.available){
    // adjust the listing's stock
    inventory.units += newUnits;
    // insert it back into the inventory
    life.current.inventory = common.replaceObjFromArr(inventory, life.current.inventory);
  }else{
    // they don't have enough available storage
    life.actions.push({
      turn: life.current.turn,
      type: "event - failed (storage)",
      data: adjustment
    });
  }
  return life;
}

function adjustCurrentCash(life, adjustment){
  // adjust the user's cash
  life.current.finance.cash += Math.round(adjustment.amount * game.market.base_price);
  return life;
}
