'use strict';

const expect = require('chai').expect;

const main = require('./00-main');
const config = main.config
const common = main.common;
const model = main.model;

const hotel = main.hotel;

let life;

describe('Hotel - Hotel Validation', () => {
	before(() => {
		// set up life
		life = model.generateLife(config.PLAYER, config.LOCATION);
		life.testing = true;
  });

	it('hotel should show checked in as the starting value', function hotelValidation(done) {
		expect(life.current).to.have.property('hotel');
		expect(life.current.hotel).to.be.a('boolean');
		expect(life.current.hotel).to.equal(true);
		return done();
	});
});
