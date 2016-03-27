'use strict';

import constants from './constants';
import AgarioClient from './agario-client/client';
import dom from './dom';
import * as bootstrap from 'bootstrap';

export default class Controller {
  constructor(client) {
    this.client = client;

    this.server = {
      region: 'EU-London',
      ws: '127.0.0.1:9158',
      token: '',
    };
    this.nick = constants.DEFAULT_NICKNAME;
    this.autoRespawn = false;

    setTimeout(() => {
      console.log('creating room');
      this.createRoom();
    }, 2000);

    this.initDomEventHandlers();
    this.initKeyboardEventHandlers();
    this.initGameEventHandlers();
    this.updatePlayerNumbers();
  }

  initDomEventHandlers() {
    dom.playBtn.click(() => {
      this.client.spawn(dom.nick.val());
      dom.overlay.hide();
    });

    dom.joinBtn.click(this.joinRoom.bind(this));
    dom.createBtn.click(this.createRoom.bind(this));

    dom.spectateBtn.click(() => {
      this.client.spectate();
      dom.overlay.hide();
    });

    dom.region.change(this.createRoom.bind(this));
    dom.gameMode.change(this.createRoom.bind(this));
  }

  initKeyboardEventHandlers() {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) { // ESC
        this.togglePanel();
      }
    });
  }

  initGameEventHandlers() {
    this.client.on('reset', () => {
      dom.leaderBoard.html('');
      dom.overlay.show();
    });

    this.client.on('lostMyBalls', () => {
      dom.overlay.show();
    });

    this.client.on('scoreUpdate', () => {
      dom.statusBox.html(`Score: ${this.client.score}`);
    });

    this.client.on('leaderBoardUpdate', (old, leaders) => {
      let leaderBoards = [];
      leaders.forEach((item, index) => {
        let text = `${index + 1}. ${item[1] || 'An unnamed cell'}`;
        if (item[0]) { // current user
          text = `<div class="me">${text}</div>`;
        } else {
          text = `<div>${text}</div>`;
        }
        leaderBoards.push(text);
      });

      dom.leaderBoard.html(leaderBoards.join('\n'));
    });
  }

  updatePlayerNumbers() {
    AgarioClient.Server.fetchInfo((err, info) => {
      if (err)
        return err;
      dom.regionOptions.each((n, elem) => {
        elem.text = elem.text.split(' (')[0];
        const numPlayers = (info.regions[elem.value] || {}).numPlayers;
        if (typeof numPlayers === 'number')
          elem.text += ` (${numPlayers} players)`;
      });
    });
  }

  togglePanel() {
    dom.overlay.toggle();
  }

  disconnect() {
    this.client.disconnect();
  }

  connect(ws, token) {
    this.client.connect(`ws://${ws}`, token);
  }

  spectate() {
    this.client.spectate();
  }

  connectHandler(err, ip, token) {
    if (err) {
      throw err;
    } else {
      this.disconnect();
      this.connect(ip, token);
      if (token.length === 5) {
        dom.token.val(token);
        dom.gameMode.val(':party');
      } else {
        dom.token.val('');
      }
    }
  }

  createRoom() {
    var gameMode = dom.gameMode.val();
    switch (gameMode) {
      case '':
        this.createFfaRoom();
        break;
      case ':teams':
        this.createTeamRoom();
        break;
      case ':experimental':
        this.createExperimentalRoom();
        break;
      case ':party':
        this.createPartyRoom();
        break;
      default:
        this.createPartyRoom();
    }
  }

  joinRoom() {
    var token = dom.token.val();
    this.joinPartyRoom(token);
  }

  createFfaRoom() {
    AgarioClient.Server.createFfaRoom(dom.region.val(), this.connectHandler.bind(this));
  }

  createTeamRoom() {
    AgarioClient.Server.createTeamRoom(dom.region.val(), this.connectHandler.bind(this));
  }

  createExperimentalRoom() {
    AgarioClient.Server.createExperimentalRoom(dom.region.val(), this.connectHandler.bind(this));
  }

  createPartyRoom() {
    AgarioClient.Server.createPartyRoom(dom.region.val(), this.connectHandler.bind(this));
  }

  joinPartyRoom(token) {
    AgarioClient.Server.joinPartyRoom(token, this.connectHandler.bind(this));
  }

  spawn() {
    this.client.spawn(this.nick);
  }

}
