'use strict';

const AnimatedValue = require('../client/js/animated-value');
const expect = require('chai').expect;

describe('AnimatedValue', function () {
  describe('.constructor()', function () {
    it('should set initial value', function () {
      expect(new AnimatedValue(10).get()).to.be.equal(10);
      expect(new AnimatedValue(20).get()).to.be.equal(20);
    });
  });

  describe('.write()', function () {
    it('should set value immediately', function () {
      let v = new AnimatedValue(10);
      v.write(20);
      expect(v.get()).to.be.equal(20);
    });
  });

  describe('.set()', function () {
    it('should not set value immediately', function () {
      let v = new AnimatedValue(10);
      v.set(20, 50);
      expect(v.get()).to.be.equal(10);
    });
    it('should set value after some time', function (done) {
      let v = new AnimatedValue(10);
      v.set(20, 50);
      setTimeout(() => {
        expect(v.get()).to.be.equal(20);
        done();
      }, 60);
    });
  });

  describe('.follow()', function () {
    // test is not implemented yet
  });
});
