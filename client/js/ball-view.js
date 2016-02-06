'use strict';

var PIXI = require('pixi.js');
var AnimatedValue = require('./animated-value');

function BallView(main, ball) {
  this.main = main;
  this.ball = ball;
  this.container = new PIXI.Container();
  this.graphic = new PIXI.Graphics();
  this.container.addChild(this.graphic);

  this.x = new AnimatedValue(0);
  this.y = new AnimatedValue(0);
  this.s = new AnimatedValue(0);

  var _this = this;
  this.appear();
  this.ball.on('appear', function () {
    _this.appear();
  });
  this.ball.on('destroy', function (reason) {
    if (reason.reason == 'eaten') {
      var eater = _this.main.balls[reason.by];
      if (eater && eater.ball.id != _this.ball.id) {
        _this.x.follow(function () {
          return eater.x.get();
        }, 100);
        _this.y.follow(function () {
          return eater.y.get();
        }, 100);
        setTimeout(function () {
          _this.disappear();
        }, 50);
      } else {
        _this.disappear();
      }
    } else {
      _this.disappear();
    }
  });
  this.ball.on('disappear', function () {
    _this.disappear();
  });
  this.ball.on('move', function (old_x, old_y, new_x, new_y) {
    _this.x.set(new_x, 100);
    _this.y.set(new_y, 100);
  });
  this.ball.on('resize', function (old_size, new_size) {
    _this.s.set(new_size, 100);
    _this.main.zSort(new_size);
  });
}

BallView.prototype = {
  appear: function () {
    this.x.write(this.ball.x);
    this.y.write(this.ball.y);
    this.s.set(this.ball.size, 100);
    this.shape();
    this.setName();
    this.setMass();
    this.main.zSort(this.ball.size);
    this.main.stage.addChild(this.container);
  },
  disappear: function () {
    this.s.set(0, 100);
    var _this = this;
    setTimeout(function () {
      _this.main.stage.removeChild(_this.container);
    }, 100);
  },
  shape: function () {
    this.graphic.clear();
    this.graphic.beginFill(this.ball.virus ? 0x005500 : this.ball.color.replace('#', '0x'), 1);
    this.graphic.drawCircle(0, 0, 1);
    this.graphic.endFill();
  },
  setName: function () {
    if (this.ball.name) {
      if (!this.name) {
        this.name = new PIXI.Text(this.ball.name, {
          font: 'bold 20pt Arial',
          fill: 0xFFFFFF,
          stroke: 0x000000,
          strokeThickness: 5
        });
        var _this = this;
        this.ball.on('rename', function () {
          _this.updateName();
        });
      }
      this.updateName();
      this.container.addChild(this.name);
    } else {
      if (this.name) {
        this.container.removeChild(this.text);
        this.ball.removeAllListener('rename');
        delete this.text;
      }
    }
  },
  updateName: function () {
    this.name.resolution = 10;
    this.name.scale.x = this.name.scale.y *= 2 * 0.9 / this.name.width;
    this.name.position.x = -this.name.width / 2;
    this.name.position.y = -this.name.height / 2;
  },
  setMass: function () {
    if (this.ball.mine) {
      if (!this.mass) {
        this.mass = new PIXI.Text(this.ball.size, {
          font: 'bold 20pt Arial',
          fill: 0xFFFFFF,
          stroke: 0x000000,
          strokeThickness: 5
        });
        var _this = this;
        this.ball.on('resize', function () {
          _this.updateMass();
        });
      }
      this.updateMass();
      this.container.addChild(this.mass);
    } else {
      if (this.mass) {
        this.container.removeChild(this.mass);
        this.ball.removeAllListeners('rename');
        delete this.mass;
      }
    }
  },
  updateMass: function () {
    this.mass.text = this.ball.size;
    this.mass.resolution = 10;
    this.mass.scale.x = this.mass.scale.y *= 0.5 / this.mass.width;
    this.mass.position.x = -this.mass.width / 2;
    this.mass.position.y = this.name ? this.name.height / 2 : 0;
  },
  render: function () {
    this.container.position.x = this.x.get();
    this.container.position.y = this.y.get();
    this.container.scale.x = this.container.scale.y = this.s.get();
  }
};

module.exports = BallView;
