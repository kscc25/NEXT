'use strict';

const Misc = require('../client/js/misc.js');
const expect = require('chai').expect;

describe('Misc', function () {
  describe('.ensureRange()', function () {
    it('should return left boundary if the value below left boundary', function () {
      expect(Misc.ensureRange(-50, -20, +20)).to.be.equal(-20);
    });

    it('should return right boundary if the value above right boundary', function () {
      expect(Misc.ensureRange(+50, -20, +20)).to.be.equal(+20);
    });

    it('should return the value if the value is within boundaries', function () {
      expect(Misc.ensureRange(+15, -20, +20)).to.be.equal(+15);
    });
  });
});
