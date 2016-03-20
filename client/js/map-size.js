'use strict';

class MapSize {
  constructor(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }
  centerX() { return (this.minX + this.maxX) / 2; }
  centerY() { return (this.minY + this.maxY) / 2; }
  width() { return this.maxX - this.minX; }
  height() { return this.maxY - this.minY; }
  isLegit() { return this.width() >= 6000 && this.height() >= 3400; }
  static default() {
    const dim = -1000;
    return new MapSize(-dim, dim, -dim, dim);
  }
}

module.exports = MapSize;
