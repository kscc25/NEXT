'use strict';

import $ from 'jquery';

const overlay = $('.overlay');
const mainPanel = overlay.find('.main-panel');
const leaderBoard = $('#leaderboard div');
const statusBox = $('#status-box');
const nick = mainPanel.find('input#nick');
const playBtn = mainPanel.find('button#playBtn');
const joinBtn = mainPanel.find('button#joinBtn');
const createBtn = mainPanel.find('button#createBtn');
const region = mainPanel.find('#region');
const gameMode = mainPanel.find('#gameMode');
const token = mainPanel.find('#token');

export default {
  overlay: overlay,
  mainPanel: mainPanel,
  leaderBoard: leaderBoard,
  statusBox: statusBox,
  nick: nick,
  playBtn: playBtn,
  region: region,
  gameMode: gameMode,
  token: token,
  joinBtn: joinBtn,
  createBtn: createBtn,
};
