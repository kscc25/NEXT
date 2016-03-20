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

  describe('.isLegit()', function () {
    it('should be true on full world size', function () {
      expect(new MapSize(-6796.050310292858,
                         -9203.937550139428,
                         +7346.085313438094,
                         +4938.198073591524).isLegit())
            .to.be.true;
    });
    it('should be false on partial world size', function () {
      expect(new MapSize(-3517.222111139978,
                         +1457.9073725840553,
                         +2242.777888860022,
                         +4697.907372584055).isLegit())
            .to.be.false;
    });
  });

  it('should have default() constructor', function () {
    expect(MapSize.default()).to.be.an.instanceof(MapSize);
  });
});
