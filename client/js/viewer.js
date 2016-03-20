'use strict';

const MapSize = require('./map-size');
const PIXI = require('pixi.js');
const AnimatedValue = require('./animated-value');
const BallView = require('./ball-view');
const Misc = require('./misc');
const Stats = require('stats.js');
const EventEmitter = require('events').EventEmitter;

class Viewer extends EventEmitter {
  constructor(client, container) {
    super();
    this.client = client;
    this.container = container;

    this.balls = {};

    this.addRenderer();
    this.addStats();
    this.mapSize = MapSize.default();
    client.once('connected', () => {
      this.zoom = 0;
      this.initStage();
      this.addListners();
      this.animate();
      this.homeview = true;
      client.once('myNewBall', () => this.homeview = false);
      this.emit('launched');
    });
    client.on('mapSizeLoad', (minX, minY, maxX, maxY) => {
      const mapSize = new MapSize(minX, minY, maxX, maxY);
      if (mapSize.isLegit()) {
        this.mapSize = mapSize;
        this.updateBorders();
      }
    });
    window.addEventListener('resize', () => this.updateSize());
    window.addEventListener('wheel', e => this.modifyZoom(e.deltaY));
  }

  getSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  addRenderer() {
    this.getSize();
    this.renderer = PIXI.autoDetectRenderer(this.width, this.height, {
      antialias: true,
      backgroundColor: 0x111111,
    });
    this.container.appendChild(this.renderer.view);
  }

  updateSize() {
    this.getSize();
    this.renderer.resize(this.width, this.height);
  }

  defaultScale() {
    return Math.max(this.width / 1920, this.height / 1080);
  }

  modifyZoom(amount) {
    this.zoom -= Math.sign(amount) * 0.25;
    this.zoom = Misc.ensureRange(this.zoom, -5, 1.5);
  }

  initStage() {
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
  }

  addListners() {
    this.client.on('ballAppear', id => {
      if (!this.balls[id]) {
        this.balls[id] = new BallView(this, this.client.balls[id]);
      }
    });
    this.client.on('ballDestroy', id => delete this.client.balls[id]);
  }

  updateBorders() {
    if (!this.borders) {
      this.borders = new PIXI.Graphics();
      this.stage.addChild(this.borders);
    }
    this.borders.clear();
    this.borders.lineStyle(5, 0xFF3300, 1);
    const s = this.mapSize;
    this.borders.drawRect(s.minX, s.minY, s.width(), s.height());
  }

  addStats() {
    this.stats = new Stats();
    this.stats.setMode(1);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild(this.stats.domElement);
  }

  zSort(at) {
    if (!at) {
      at = 0;
    }
    const keys = Object.keys(this.balls);
    keys.sort((a, b) => this.balls[a].ball.size - this.balls[b].ball.size);
    for (const keyOffset in keys) {
      const ball = this.balls[keys[keyOffset]];
      if (ball.ball.size >= at) {
        ball.container.bringToFront();
      }
    }
  }

  posCamera() {
    let x, y, p;
    x = y = p = 0;
    for (const ballId in this.client.my_balls) {
      const ball = this.client.balls[this.client.my_balls[ballId]];
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
  }

  render() {
    for (const ballId in this.client.balls) {
      const ball = this.balls[ballId];
      if (ball) {
        ball.render();
      }
    }
  }

  animate() {
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
    requestAnimationFrame(() => this.animate());
  }
}

module.exports = Viewer;
