'use strict';

/* global performance: false */

var PIXI = require('pixi.js');

var Client = require('heroandtn3/agario-client');
var Controller = require('./controller');
var Viewer = require('./viewer');
var Pointer = require('./pointer');

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
  d.viewer = new Viewer(d.client, document.getElementById('viewer'));
  d.controller = new Controller(d.client);
  d.pointer = new Pointer(d.viewer);
};
