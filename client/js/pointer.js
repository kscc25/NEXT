'use strict';

function Pointer(viewer) {
  this.viewer = viewer;
  this.client = this.viewer.client;
  this.dest = { // Destination, relative to camera center
    x: 0,
    y: 0
  };
  var _this = this;
  this.viewer.once('launched', function () {
    _this.viewer.stage.interactive = true;
    _this.viewer.stage.on('mousemove', function (e) {
      _this.pointermove(e);
    });
    _this.viewer.stage.on('touchmove', function (e) {
      _this.pointermove(e);
    });
    _this.viewer.on('animate', function (e) {
      _this.move();
    });
  });
  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 87) {
      _this.client.eject();
    } else if (e.keyCode == 32) {
      _this.client.split();
    }
  });
}

Pointer.prototype = {
  move: function () {
    this.client.moveTo(this.viewer.cam.x.get() + this.dest.x, this.viewer.cam.y.get() + this.dest.y);
  },
  pointermove: function (e) {
    var gamePos = e.data.getLocalPosition(this.viewer.stage);
    this.dest = {
      x: gamePos.x - this.viewer.cam.x.get(),
      y: gamePos.y - this.viewer.cam.y.get()
    };
    if (Math.abs(this.dest.x) < 10 && Math.abs(this.dest.y) < 10) {
      this.dest = {
        x: 0,
        y: 0
      };
    }
    this.move();
  }
};

module.exports = Pointer;
