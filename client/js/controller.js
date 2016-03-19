'use strict';

import Dat from 'dat-gui';
import Connector from './connector';
import constants from './constants';
import AgarioClient from './agario-client/client';
import dom from './dom';
import * as bootstrap from 'bootstrap';

export default class Controller {
  constructor(client) {
    const _this = this;
    this.client = client;
    this.connector = new Connector();

    this.server = {
      region: 'EU-London',
      ws: '127.0.0.1:9158',
      token: '',
    };
    this.nick = constants.DEFAULT_NICKNAME;
    this.autoRespawn = false;

    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) { // ESC
        this.togglePanel();
      }
    });

    dom.playBtn.click(() => {
      client.spawn(dom.nick.val());
      dom.overlay.hide();
    });

    dom.region.change(() => {
      client.disconnect();
      _this.connector.findParty(dom.region.val());
    });


    client.on('scoreUpdate', () => {
      dom.statusBox.html(`Score: ${client.score}`);
    });

    client.on('reset', () => {
      dom.leaderBoard.html('');
      dom.overlay.show();
    });
    client.on('lostMyBalls', () => {
      dom.overlay.show();
    });
    client.on('leaderBoardUpdate', (old, leaders) => {
      var leaderBoards = [];
      leaders.forEach((id, index) => {
        leaderBoards.push(`${index + 1}. ` + client.balls[id].name || 'An unnamed cell');
      });
      console.log(old, leaders);
      dom.leaderBoard.html(leaderBoards.join('<br />'));
    });

    this.connector.onconnect = (...args) => this.connect(...args);
    setTimeout(() => this.findParty(), 2000);
  }

  togglePanel() {
    dom.overlay.toggle();
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
    this.client.connect(`ws://${ws}`, token);
  }

  spawn() {
    this.client.spawn(this.nick);
  }

}
