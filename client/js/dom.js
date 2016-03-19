'use strict';

import $ from 'jquery';

const overlay = $('.overlay');
const mainPanel = overlay.find('.main-panel');
const leaderBoard = $('#leaderboard div');
const statusBox = $('#status-box');
const nick = mainPanel.find('input#nick');
const playBtn = mainPanel.find('button#playBtn');
const region = mainPanel.find('#region');
const gameMode = mainPanel.find('#gameMode');

export default {
  overlay: overlay,
  mainPanel: mainPanel,
  leaderBoard: leaderBoard,
  statusBox: statusBox,
  nick: nick,
  playBtn: playBtn,
  region: region,
  gameMode: gameMode,
};
