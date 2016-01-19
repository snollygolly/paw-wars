'use strict';

const expect = require('chai').expect;

const main = require('./main');
const config = main.config
const common = main.common;
const model = main.model;

const market = main.market;

let life;

describe('Market - Transaction Error Validation (Buy)', () => {
	let oldLife;
	let oldListing;
	let oldInventory;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		oldListing = common.getObjFromID(config.ITEM.id, oldLife.listings.market);
		oldInventory = {
			id: config.ITEM.id,
			units: 0
		}
  });

	it('market should refuse buy order if not enough storage', function refuseBuy(done) {
		let transaction = makeTransaction("buy");
		transaction.units = config.GAME.market.starting_storage + 100;
		let newLife = market.doMarketTransaction(oldLife, transaction);
		// check for errors
		expect(newLife).to.have.property('error');
		return done();
	});

	it('market should refuse buy order if not enough available', function refuseBuy(done) {
		let transaction = makeTransaction("buy");
		transaction.units = oldListing.units + 100;
		let newLife = market.doMarketTransaction(oldLife, transaction);
		// check for errors
		expect(newLife).to.have.property('error');
		return done();
	});

	it('market should refuse buy order if not enough cash', function refuseBuy(done) {
		let transaction = makeTransaction("buy");
		transaction.units = config.GAME.market.starting_storage;
		oldLife.current.finance.cash = 1;
		let newLife = market.doMarketTransaction(oldLife, transaction);
		// check for errors
		expect(newLife).to.have.property('error');
		return done();
	});
});

describe('Market - Transaction Error Validation (Buy)', () => {
	let oldLife;
	let oldListing;
	let oldInventory;

	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;

		oldLife = JSON.parse(JSON.stringify(life));
		oldListing = common.getObjFromID(config.ITEM.id, oldLife.listings.market);
		oldInventory = {
			id: config.ITEM.id,
			units: 0
		}
  });

	it('market should refuse sell order if not enough inventory', function refuseSell(done) {
		let transaction = makeTransaction("sell");
		transaction.units = config.GAME.market.starting_storage + 100;
		let newLife = market.doMarketTransaction(oldLife, transaction);
		// check for errors
		expect(newLife).to.have.property('error');
		return done();
	});
});

function makeTransaction(type){
  return {
    id: "testing",
    type: type,
    item: config.ITEM.id,
    units: config.UNITS
  };
}
