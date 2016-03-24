'use strict';

/* global performance: false */

import PIXI from 'pixi.js';

import Client from './agario-client/client';
import Controller from './controller';
import Viewer from './viewer';
import Pointer from './pointer';

PIXI.Container.prototype.bringToFront = function () {
  if (this.parent) {
    var parent = this.parent;
    parent.removeChild(this);
    parent.addChild(this);
  }
};

var d = {}; // DEBUG Allow access from console
window.onload = function () {
  d.client = new Client('worker');
  d.viewer = new Viewer(d.client);
  d.controller = new Controller(d.client);
  d.pointer = new Pointer(d.viewer);
};
