'use strict';

exports.ensureRange = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};
