'use strict';

export default class Server {

  createRoom(region, callback) {
    let req = new XMLHttpRequest();

    req.open('POST', 'http://m.agar.io');
    req.send(region);
    req.addEventListener('load', () => {
      if (req.status == 200) {
        let s = req.responseText.split('\n');
        if (s[0] === '0.0.0.0:0') {
          return callback(new Error('0.0.0.0:0 IP'));
        }
        return callback(null, s[0], s[1]);
      }

      callback(new Error('Failed to create room, status code: ' + req.status));
    });
  }

  createFfaRoom(region, callback) {
    this.createRoom(region, callback);
  }

  createTeamRoom(region, callback) {
    this.createRoom(region + ':teams', callback);
  }

  createExperimentalRoom(region, callback) {
    this.createRoom(region + ':experimental', callback);
  }

  createPartyRoom(region, callback) {
    this.createRoom(region + ':party', callback);
  }

  joinPartyRoom(token, callback) {
    let req = new XMLHttpRequest();

    req.open('POST', 'http://m.agar.io/getToken');
    req.send(token);
    req.addEventListener('load', () => {
      if (req.status === 200) {
        callback(null, req.responseText.split('\n')[0], token);
      } else {
        callback(new Error('Failed to join party room, status code ' + req.status));
      }
    });
  }

}
