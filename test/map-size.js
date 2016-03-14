'use strict';

const MapSize = require('../client/js/map-size');
const expect = require('chai').expect;

describe('MapSize', function () {
  it('should have proper centerX', function () {
    expect(new MapSize(-10, -20, 30, 50).centerX()).to.be.equal(10);
  });

  it('should have proper centerY', function () {
    expect(new MapSize(-10, -20, 30, 50).centerY()).to.be.equal(15);
  });

  it('should have proper width', function () {
    expect(new MapSize(-10, -20, 30, 50).width()).to.be.equal(40);
  });

  it('should have proper height', function () {
    expect(new MapSize(-10, -20, 30, 50).height()).to.be.equal(70);
  });

  it('should have default() constructor', function () {
    expect(MapSize.default()).to.be.an.instanceof(MapSize);
  });
});
