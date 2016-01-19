"use strict";

const game = require('../../game.json');
const items = require('./items.json');
const events = require('./events.json');
const common = require('../../helpers/common');
const model = require('../game_life.js');

module.exports.simulateEvents = function simulateEvents(life){
  let newLife = JSON.parse(JSON.stringify(life));
  // see if we even get an event
  let eventRoll = common.getRandomInt(0, 100);
  // see if our roll is good enough for an event
  if (game.events.event_rate <= eventRoll){
    // they didn't get an event
    newLife.current.event = "Nothing of interest happened this turn.";
    return newLife;
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
      newLife = adjustMarketListing(newLife, adjustment);
      break;
    case "adjust_inventory":
      // start building the adjustment object
      adjustment = {
        type: eventObj.type,
        item: items[common.getRandomInt(0, (items.length - 1))],
        units: common.getRandomArbitrary(eventObj.parameters.units.min, eventObj.parameters.units.max)
      };
      newLife = adjustCurrentInventory(newLife, adjustment);
      break;
    case "adjust_cash":
      // start building the adjustment object
      adjustment = {
        type: eventObj.type,
        amount: common.getRandomArbitrary(eventObj.parameters.amount.min, eventObj.parameters.amount.max)
      };
      newLife = adjustCurrentCash(newLife, adjustment);
      break;
  }
  // write the description
  newLife.current.event = makeDescription(eventObj, adjustment);
  // write the actions log
  newLife.actions.push({
    turn: newLife.current.turn,
    type: "event",
    data: adjustment
  })
  //console.log("* simulateEvents:", newLife);
  return newLife;
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
  let newLife = JSON.parse(JSON.stringify(life));
  // get the listing
  let listing = common.getObjFromID(adjustment.item.id, newLife.listings.market);
  // adjust the listing's stock
  listing.units = Math.round(listing.units * adjustment.units);
  // adjust the listing's price
  listing.price = Math.round(listing.price * adjustment.price);
  // insert it back into the listings
  newLife.listings.market = common.replaceObjFromArr(listing, newLife.listings.market);
  return newLife;
}

function adjustCurrentInventory(life, adjustment){
  let newLife = JSON.parse(JSON.stringify(life));
  // get the inventory
  let inventory = common.getObjFromID(adjustment.item.id, newLife.current.inventory);
  if (inventory === false){
    // we searched the inventory for this object, but didn't find it, lets make it
    inventory = {
      id: adjustment.item.id,
      units: 0
    }
    newLife.current.inventory.push(inventory);
  }
  let newUnits = Math.round(game.market.base_units * adjustment.units);
  if (newUnits <= newLife.current.storage.available){
    // adjust the listing's stock
    inventory.units += newUnits;
    // insert it back into the inventory
    newLife.current.inventory = common.replaceObjFromArr(inventory, newLife.current.inventory);
  }else{
    // they don't have enough available storage
    newLife.actions.push({
      turn: newLife.current.turn,
      type: "event - failed (storage)",
      data: adjustment
    });
  }
  return newLife;
}

function adjustCurrentCash(life, adjustment){
  let newLife = JSON.parse(JSON.stringify(life));
  // adjust the user's cash
  newLife.current.finance.cash += Math.round(adjustment.amount * game.market.base_price);
  return newLife;
}
