'use strict';

class Connector {
  constructor() {
    this.onconnect = () => {};
    this.onerror = () => {};
    let self = this;
    this.callbacks = {
      connect(ws, token) { self.onconnect(ws, token); },
      error() { self.onerror(); },
    };
  }
  findFfa(region) {
    findByRegion(region, this.callbacks);
  }
  findParty(region) {
    this.findFfa(region + ":party");
  }
  connectParty(token) {
    findByPartyToken(token, this.callbacks);
  }
  directConnect(ws, token) {
    this.callbacks.connect({ ws, token });
  }
}

function findByRegion(region, callbacks) {
  let req = new XMLHttpRequest();
  req.open('POST', 'http://m.agar.io');
  req.send(region);
  req.addEventListener('load', () => {
    if (req.status == 200) {
      let s = req.responseText.split("\n");
      if (s[0] === '0.0.0.0:0')
        callbacks.error();
      else
        callbacks.connect(s[0], s[1]);
    } else
      callbacks.error();
  });
}

function findByPartyToken(partyToken, callbacks) {
  let req = new XMLHttpRequest();
  req.open('POST', 'http://m.agar.io/getToken');
  req.send(partyToken);
  req.addEventListener('load', () => {
    if (req.status === 200)
      callbacks.connect(req.responseText.split("\n")[0],
                 partyToken);
    else
      callbacks.error();
  });
}

module.exports = Connector;
