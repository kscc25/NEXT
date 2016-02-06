'use strict';

var MapSize = require('./map-size');
var PIXI = require('pixi.js');
var AnimatedValue = require('./animated-value');
var BallView = require('./ball-view');
var Misc = require('./misc');
var Stats = require('stats.js');
var EventEmitter = require('events').EventEmitter;

function Viewer(client, container) {
  this.client = client;
  this.container = container;

  this.balls = {};

  this.addRenderer();
  this.addStats();
  this.mapSize = MapSize.default();
  var _this = this;
  client.once('mapSizeLoad', function (min_x, min_y, max_x, max_y) {
    _this.mapSize = new MapSize(min_x, min_y, max_x, max_y);
    _this.gameWidth = max_x;
    _this.gameHeight = max_y;
    _this.zoom = 0;
    _this.initStage();
    _this.addListners();
    _this.addBorders();
    _this.animate();
    _this.homeview = true;
    client.once('myNewBall', function() {
      _this.homeview = false;
    });
    _this.emit('launched');
  });
  window.addEventListener('resize', function () {
    _this.updateSize();
  });
  window.addEventListener('wheel', e => _this.modifyZoom(e.deltaY));
}

Viewer.prototype = {
  getSize: function () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },
  addRenderer: function () {
    this.getSize();
    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
      antialias: true
    });
    this.container.appendChild(this.renderer.view);
  },
  updateSize: function () {
    this.getSize();
    this.renderer.resize(this.width, this.height);
  },
  defaultScale: function () {
    return Math.max(this.width / 1920, this.height / 1080);
  },
  modifyZoom: function(amount) {
    this.zoom -= Math.sign(amount) * 0.25;
    this.zoom = Misc.ensureRange(this.zoom, -5, 1.5);
  },
  initStage: function () {
    this.stage = new PIXI.Container();
    this.cam = {
      x: new AnimatedValue(this.mapSize.centerX()),
      y: new AnimatedValue(this.mapSize.centerY()),
      s: new AnimatedValue(this.defaultScale()),
      z: new AnimatedValue(this.zoom),
    };
    this.d = {};
    this.dg = new PIXI.Graphics();
    this.stage.addChild(this.dg);
  },
  addListners: function () {
    var _this = this;
    this.client.on('ballAppear', function (id) {
      if (!_this.balls[id]) {
        _this.balls[id] = new BallView(_this, this.balls[id]);
      } else {}
    });
    this.client.on('ballDestroy', function (id) {
      delete this.balls[id];
    });
  },
  addBorders: function () {
    this.borders = new PIXI.Graphics();
    this.borders.lineStyle(5, 0xFF3300, 1);
    let s = this.mapSize;
    this.borders.drawRect(s.minX, s.minY, s.width(), s.height());
    this.stage.addChild(this.borders);
  },
  addStats: function () {
    this.stats = new Stats();
    this.stats.setMode(1);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild(this.stats.domElement);
  },
  zSort: function (at) {
    if (!at) {
      at = 0;
    }
    var keys = Object.keys(this.balls);
    var _this = this;
    keys.sort(function (a, b) {
      return _this.balls[a].ball.size - _this.balls[b].ball.size;
    });
    for (var key_offset in keys) {
      var ball = this.balls[keys[key_offset]];
      if (ball.ball.size >= at) {
        ball.container.bringToFront();
      }
    }
  },
  posCamera: function () {
    var x, y, p;
    x = y = p = 0;
    for (var ball_id in this.client.my_balls) {
      var ball = this.client.balls[this.client.my_balls[ball_id]];
      if (!ball.visible) continue;
      x += ball.x * ball.size;
      y += ball.y * ball.size;
      p += ball.size;
    }
    if (p > 0) { // if we have visible ball(s)
      this.cam.x.set(x / p, 100);
      this.cam.y.set(y / p, 100);
      this.cam.s.set(Math.pow(Math.min(64 / p, 1), 0.4) * this.defaultScale(), 500);
    } else if (this.homeview) {
      this.cam.s.write(this.defaultScale());
    } // else: don't move the camera
    this.cam.z.set(this.zoom, 100);
  },
  render: function () {
    for (var ball_id in this.client.balls) {
      var ball = this.balls[ball_id];
      if (ball) {
        ball.render();
      }
    }
  },
  animate: function () {
    this.stats.begin();
    this.render();
    this.posCamera();
    this.stage.scale.x = this.stage.scale.y =
      this.cam.s.get() * Math.pow(2, this.cam.z.get());
    this.stage.position.x = -this.cam.x.get() * this.stage.scale.x + this.width / 2;
    this.stage.position.y = -this.cam.y.get() * this.stage.scale.y + this.height / 2;
    this.renderer.render(this.stage);
    this.stats.end();
    this.emit('animate');
    var _this = this;
    requestAnimationFrame(function () {
      _this.animate();
    });
  }
};

// Inherit from EventEmitter
for (var key in EventEmitter.prototype) {
  Viewer.prototype[key] = EventEmitter.prototype[key];
}

module.exports = Viewer;
