'use strict';

class AnimatedValue {
  constructor(value) {
    this.write(value);
  }

  get() {
    if (this.timeout) {
      const now = Date.now();
      const end = this.frTime + this.timeout;
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
  }

  set(value, timeout) {
    if (value != this.toVal) {
      this.frVal = this.get();
      this.toVal = value;
      this.timeout = timeout;
      this.following = undefined;
      this.frTime = Date.now();
    }
  }

  follow(following, timeout) {
    this.frVal = this.get();
    this.following = following;
    this.timeout = timeout;
    this.frTime = Date.now();
  }

  write(value) {
    this.frVal = value;
    this.toVal = value;
    this.timeout = 0;
    this.frTime = Date.now(); // so end == now
  }
}

module.exports = AnimatedValue;
