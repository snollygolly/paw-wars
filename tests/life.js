'use strict';

const chai = require('chai');
const expect = chai.expect;
const model = require('../models/game_life');
const places = require('../models/game/places.json');

// generate a new life with the player id of "testing" and start in the first place on the list
const life = model.generateLife("testing", {location: places[0]});

describe('Life Model Structure Validation', function describeSelect() {
  it('life should not be null', function isNotNull(done) {
    expect(life).to.not.be.a('null');
    return done();
  });

  it('life should have required properties', function hasRequiredProperties(done) {
    expect(life).to.be.an('object');
    expect(life).to.have.property('id');
    expect(life).to.have.property('starting');
    expect(life).to.have.property('current');
    expect(life).to.have.property('listings');
    expect(life).to.have.property('actions');
    return done();
  });

});
