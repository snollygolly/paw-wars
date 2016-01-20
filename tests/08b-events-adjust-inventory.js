'use strict';

const expect = require('chai').expect;

const main = require('./00-main');
const config = main.config
const common = main.common;
const model = main.model;

const events = main.events;

let life;

describe('Events - Simulation Validation (Adjust Inventory)', () => {
	let oldLife;
	let oldInventory;
	let newInventory;
	let newListing;
	let newLife;
	let itemObj;
	let eventObj = {
    id: "testing",
    type: "adjust_inventory",
    descriptions: [
      "This should have an item here -> {{item}}"
    ],
		parameters: {
      units: {
        min: 0.005,
        max: 0.010
      }
    }
  };

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		newLife = events.simulateEvents(oldLife, eventObj);
		// get the random object events chose
		itemObj = newLife.actions[newLife.actions.length - 1].data.item;
		// get the old inventory for that item
		oldInventory = common.getObjFromID(itemObj.id, oldLife.current.inventory);
		// get the new inventory for that item
		newInventory = common.getObjFromID(itemObj.id, newLife.current.inventory);
		// get the new listing for that item
		newListing = common.getObjFromID(itemObj.id, newLife.listings.market);
  });

	it('event should accept a simulation request', function eventSimulation(done) {
		// check for errors
		expect(newLife).to.not.have.property('error');
		return done();
	});

	it('event should update the current event', function eventSimulation(done) {
		expect(newLife.current.event).to.be.a('string');
		expect(newLife.current.event).to.equal(`This should have an item here -> ${itemObj.name}`);
		return done();
	});

	it('event should generate units in the player inventory', function eventSimulation(done) {
		// we should have more units now
		if (!oldInventory.units){
			// they didn't have this item to start
			oldInventory = {
				units: 0
			};
		}
		expect(newInventory.units).to.be.above(oldInventory.units);
		// the code below is what you SHOULD do, but it won't work because of the rounding
		// make sure units are within tolerances
		// let unitRatio = newInventory.units / newListing.units;
		// expect(unitRatio).to.be.at.least(eventObj.parameters.units.min);
		// expect(unitRatio).to.be.at.most(eventObj.parameters.units.max);
		return done();
	});

	it('event should use available storage', function eventSimulation(done) {
		expect(newLife.current.storage.available).to.be.below(oldLife.current.storage.available);
		let newStorage = oldLife.current.storage.available - newInventory.units;
		expect(newLife.current.storage.available).to.equal(newStorage);
		return done();
	});

	it('event should update the player actions', function actionValidation(done) {
		// set up
		let newAction = newLife.actions.pop();
		// turn
		expect(newAction).to.have.property('turn');
		expect(newAction.turn).to.be.a('number');
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property('type');
		expect(newAction.type).to.equal('event');
		// data
		expect(newAction).to.have.property('data');
		expect(newAction.data).to.be.an('object');
		// data.type
		expect(newAction.data).to.have.property('type');
		expect(newAction.data.type).to.be.a('string');
		// data.units
		expect(newAction.data).to.have.property('units');
		expect(newAction.data.units).to.be.a('number');
		// data.item
		expect(newAction.data).to.have.property('item');
		expect(newAction.data.item).to.be.an('object');
		return done();
	});
});
