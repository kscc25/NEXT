'use strict';

export default class Ball {

  constructor(client, id) {
    if (client.balls[id]) return client.balls[id];

    this.id = id;
    this.name = null;
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.mass = 0;
    this.virus = false;
    this.mine = false;

    this.client = client;
    this.destroyed = false;
    this.visible = false;
    this.last_update = Date.now();
    this.update_tick = 0;

    client.balls[id] = this;
    return this;
  }

  destroy(reason) {
    this.destroyed = reason;
    delete this.client.balls[this.id];
    var mine_ball_index = this.client.my_balls.indexOf(this.id);
    if (mine_ball_index > -1) {
      this.client.my_balls.splice(mine_ball_index, 1);
      this.client.emitEvent('mineBallDestroy', this.id, reason);
      if (!this.client.my_balls.length) this.client.emitEvent('lostMyBalls');
    }

    this.emitEvent('destroy', reason);
    this.client.emitEvent('ballDestroy', this.id, reason);
  }

  setCords(new_x, new_y) {
    if (this.x == new_x && this.y == new_y) return;
    var old_x = this.x;
    var old_y = this.y;
    this.x = new_x;
    this.y = new_y;

    if (!old_x && !old_y) return;
    this.emitEvent('move', old_x, old_y, new_x, new_y);
    this.client.emitEvent('ballMove', this.id, old_x, old_y, new_x, new_y);
  }

  setSize(new_size) {
    if (this.size == new_size) return;
    var old_size = this.size;
    this.size = new_size;
    this.mass = parseInt(Math.pow(new_size / 10, 2));

    if (!old_size) return;
    this.emitEvent('resize', old_size, new_size);
    this.client.emitEvent('ballResize', this.id, old_size, new_size);
    if (this.mine) this.client.updateScore();
  }

  setName(name) {
    if (this.name == name) return;
    var old_name = this.name;
    this.name = name;

    this.emitEvent('rename', old_name, name);
    this.client.emitEvent('ballRename', this.id, old_name, name);
  }

  update() {
    var old_time = this.last_update;
    this.last_update = Date.now();

    this.emitEvent('update', old_time, this.last_update);
    this.client.emitEvent('ballUpdate', this.id, old_time, this.last_update);
  }

  appear() {
    if (this.visible) return;
    this.visible = true;
    this.emitEvent('appear');
    this.client.emitEvent('ballAppear', this.id);

    if (this.mine) this.client.updateScore();
  }

  disappear() {
    if (!this.visible) return;
    this.visible = false;
    this.emitEvent('disappear');
    this.client.emitEvent('ballDisppear', this.id);
  }

  toString() {
    if (this.name) return this.id + '(' + this.name + ')';
    return this.id.toString();
  }

  // Fix https://github.com/pulviscriptor/agario-client/issues/95
  emitEvent() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
    try {
      this.emit.apply(this, args);
    } catch (e) {
      process.nextTick(function() {
        throw e;
      });
    }
  }
}
