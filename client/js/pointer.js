'use strict';

class Pointer {
  constructor(viewer) {
    this.viewer = viewer;
    this.client = this.viewer.client;
    this.dest = { // Destination, relative to camera center
      x: 0,
      y: 0,
    };
    this.keysPressed = {};
    this.viewer.once('launched', () => {
      this.viewer.stage.interactive = true;
      this.viewer.stage.on('mousemove', e => this.pointermove(e));
      this.viewer.stage.on('touchmove', e => this.pointermove(e));
      this.viewer.on('animate', e => this.move());
    });
    window.addEventListener('keydown', (e) => {
      if (this.keysPressed[e.keyCode]) return;
      this.keysPressed[e.keyCode] = true;
      if (e.keyCode == 87) {
        this.client.eject();
      } else if (e.keyCode == 32) {
        this.client.split();
      } else if (e.keyCode == 81) {
        this.client.spectateModeToggle();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.keyCode] = false;
    });
  }

  move() {
    this.client.moveTo(
      this.viewer.cam.x.get() + this.dest.x,
      this.viewer.cam.y.get() + this.dest.y
    );
  }

  pointermove(e) {
    const gamePos = e.data.getLocalPosition(this.viewer.stage);
    this.dest = {
      x: gamePos.x - this.viewer.cam.x.get(),
      y: gamePos.y - this.viewer.cam.y.get(),
    };
    if (Math.abs(this.dest.x) < 10 && Math.abs(this.dest.y) < 10) {
      this.dest = {
        x: 0,
        y: 0,
      };
    }
    this.move();
  }
}

module.exports = Pointer;
