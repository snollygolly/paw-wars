'use strict';

const expect = require('chai').expect;

const main = require('./00-main');
const config = main.config
const common = main.common;
const model = main.model;

const events = main.events;

let life;

describe('Events - Simulation Validation (Adjust Markets)', () => {
	let oldLife;
	let oldListing;
	let newListing;
	let newLife;
	let itemObj;
	let eventObj = {
    id: "testing",
    type: "adjust_market",
    descriptions: [
      "This should have an item here -> {{item}}"
    ],
    parameters: {
      price: {
        min: 1.50,
        max: 2.50
      },
      units: {
        min: 0.10,
        max: 0.35
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
		// get the old listing for that item
		oldListing = common.getObjFromID(itemObj.id, oldLife.listings.market);
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

	it('event should increase the price of an item', function eventSimulation(done) {
		// the price should have increased
		// TODO: make tests work with any event object, not just high price/low units
		expect(newListing.price).to.be.above(oldListing.price);
		// make sure price is within tolerances
		let priceRatio = newListing.price / oldListing.price;
		expect(priceRatio).to.be.at.least(eventObj.parameters.price.min);
		expect(priceRatio).to.be.at.most(eventObj.parameters.price.max);
		return done();
	});

	it('event should decrease units available', function eventSimulation(done) {
		// the units should have decreased
		// TODO: make tests work with any event object, not just high price/low units
		expect(newListing.units).to.be.below(oldListing.units);
		// make sure units are within tolerances
		let unitRatio = newListing.units / oldListing.units;
		expect(unitRatio).to.be.at.least(eventObj.parameters.units.min);
		expect(unitRatio).to.be.at.most(eventObj.parameters.units.max);
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
		// data.price
		expect(newAction.data).to.have.property('price');
		expect(newAction.data.price).to.be.a('number');
		// data.units
		expect(newAction.data).to.have.property('units');
		expect(newAction.data.price).to.be.a('number');
		// data.item
		expect(newAction.data).to.have.property('item');
		expect(newAction.data.item).to.be.an('object');
		return done();
	});
});
