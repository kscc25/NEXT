'use strict';

var Dat = require('dat-gui');
var Connector = require('./connector');
var constants = require('./constants');

function Controller(client) {
  this.client = client;
  this.connector = new Connector();

  this.server = {
    region: 'EU-London',
    ws: '127.0.0.1:9158',
    token: '',
  };
  this.nick = constants.DEFAULT_NICKNAME;
  this.autoRespawn = false;

  this.gui = new Dat.GUI();

  this.servgui = this.gui.addFolder('Server');

  this.servgui.add(this.server, 'region', ['US-Fremont', 'US-Atlanta', 'BR-Brazil', 'EU-London', 'RU-Russia', 'JP-Tokyo', 'CN-China', 'SG-Singapore', 'TK-Turkey']);
  this.servgui.add(this, 'findFfa');
  this.servgui.add(this, 'findParty');

  this.servgui.add(this.server, 'token');
  this.servgui.add(this, 'connectParty');

  this.servgui.add(this.server, 'ws');
  this.servgui.add(this, 'directConnect');

  this.servgui.add(this, 'disconnect');

  this.servgui.open();

  this.cellgui = this.gui.addFolder('Cell');
  this.cellgui.add(this, 'nick');
  this.cellgui.add(this, 'spawn');
  this.cellgui.add(this, 'autoRespawn');
  var scoreGui = this.cellgui.add(this.client, 'score').listen();
  this.client.on('scoreUpdate', function () {
    scoreGui.updateDisplay();
  });

  this.leadergui = this.gui.addFolder('Leaderboard');
  this.leaders = {};
  this.resetLeader();
  for (var i = 1; i <= 10; i++) {
    this.leadergui.add(this.leaders, i);
  }

  var _this = this;
  client.on('connected', function () {
    _this.servgui.close();
    _this.cellgui.open();
    _this.leadergui.open();
    if (_this.autoRespawn) {
      _this.spawn();
    }
  });
  client.on('reset', function () {
    _this.servgui.open();
    _this.cellgui.close();
    _this.leadergui.close();
    _this.resetLeader();
  });
  client.on('lostMyBalls', function () {
    if (_this.autoRespawn) {
      _this.spawn();
    }
  });
  client.on('leaderBoardUpdate', function (old, leaders) {
    for (var i in leaders) {
      var rank = parseInt(i) + 1;
      _this.leaders[rank] = this.balls[leaders[i]].name || 'An unnamed cell';
      for (var j in _this.leadergui.__controllers) {
        _this.leadergui.__controllers[j].updateDisplay();
      }
    }
  });
  this.connector.onconnect = (...args) => this.connect(...args);
}

Controller.prototype = {
  findFfa() {
    this.connector.findFfa(this.server.region);
  },
  findParty() {
    this.connector.findParty(this.server.region);
  },
  connectParty() {
    this.connector.connectParty(this.server.token);
  },
  directConnect() {
    this.connector.directConnect(this.server.ws, this.server.token);
  },
  disconnect() {
    this.client.disconnect();
  },
  connect(ws, token) {
    this.server.ws = ws;
    this.server.token = token;
    for (var i in this.servgui.__controllers)
      this.servgui.__controllers[i].updateDisplay();
    this.client.connect('ws://' + ws, token);
  },
  spawn: function () {
    this.client.spawn(this.nick);
  },
  resetLeader: function () {
    for (var i = 1; i <= 10; i++) {
      this.leaders[i] = '---';
    }
  },
};

module.exports = Controller;
