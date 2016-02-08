'use strict';

function AnimatedValue(value) {
  this.write(value);
}

AnimatedValue.prototype = {
  get: function () {
    if (this.timeout) {
      var now = performance.now();
      var end = this.frTime + this.timeout;
      if (now >= end) {
        this.timeout = 0;
        return this.toVal;
      } else {
        if (this.following) {
          this.toVal = this.following();
        }
        return this.toVal - (this.toVal - this.frVal) * (end - now) / this.timeout;
      }
    } else {
      return this.toVal;
    }
  },
  set: function (value, timeout) {
    if (value != this.toVal) {
      this.frVal = this.get();
      this.toVal = value;
      this.timeout = timeout;
      this.following = undefined;
      this.frTime = performance.now();
    }
  },
  follow: function (following, timeout) {
    this.frVal = this.get();
    this.following = following;
    this.timeout = timeout;
    this.frTime = performance.now();
  },
  write: function (value) {
    this.frVal = value;
    this.toVal = value;
    this.timeout = 0;
    this.frTime = performance.now(); // so end == now
  },
};

module.exports = AnimatedValue;
