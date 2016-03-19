'use strict';

import Dat from 'dat-gui';
import Connector from './connector';
import constants from './constants';
import AgarioClient from './agario-client/client';

export default class Controller {
  constructor(client) {
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

    this.servgui.add(
      this.server,
      'region',
      ['US-Fremont', 'US-Atlanta', 'BR-Brazil', 'EU-London', 'RU-Russia', 'JP-Tokyo', 'CN-China', 'SG-Singapore', 'TK-Turkey']
    );
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
    const scoreGui = this.cellgui.add(this.client, 'score').listen();
    this.client.on('scoreUpdate', () => {
      scoreGui.updateDisplay();
    });

    this.leadergui = this.gui.addFolder('Leaderboard');
    this.leaders = {};
    this.resetLeader();
    for (let i = 1; i <= 10; i++) {
      this.leadergui.add(this.leaders, i);
    }

    client.on('connected', () => {
      this.servgui.close();
      this.cellgui.open();
      this.leadergui.open();
      if (this.autoRespawn) {
        this.spawn();
      }
    });
    client.on('reset', () => {
      this.servgui.open();
      this.cellgui.close();
      this.leadergui.close();
      this.resetLeader();
    });
    client.on('lostMyBalls', () => {
      if (this.autoRespawn) {
        this.spawn();
      }
    });
    client.on('leaderBoardUpdate', (old, leaders) => {
      for (const i in leaders) {
        let rank = parseInt(i) + 1;
        this.leaders[rank] = client.balls[leaders[i]].name || 'An unnamed cell';
        for (const j in this.leadergui.__controllers) {
          this.leadergui.__controllers[j].updateDisplay();
        }
      }
    });
    this.connector.onconnect = (...args) => this.connect(...args);
  }

  findFfa() {
    this.connector.findFfa(this.server.region);
  }

  findParty() {
    this.connector.findParty(this.server.region);
  }

  connectParty() {
    this.connector.connectParty(this.server.token);
  }

  directConnect() {
    this.connector.directConnect(this.server.ws, this.server.token);
  }

  disconnect() {
    this.client.disconnect();
  }

  connect(ws, token) {
    this.server.ws = ws;
    this.server.token = token;
    for (const i in this.servgui.__controllers)
      this.servgui.__controllers[i].updateDisplay();
    this.client.connect(`ws://${ws}`, token);
  }

  spawn() {
    this.client.spawn(this.nick);
  }

  resetLeader() {
    for (let i = 1; i <= 10; i++) {
      this.leaders[i] = '---';
    }
  }
}
