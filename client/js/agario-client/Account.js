'use strict';

import https from 'https';
import EventEmitter from 'events';

const agarClientId = '677505792353827'; //hardcoded in client

export default class Account {

  constructor(name) { //todo doc vars
    this.name = name; //debug name
    this.token = null; //token after requestFBToken()
    this.token_expire = 0; //timestamp after requestFBToken()
    this.token_provider = 1; //provider ID after requester
    this.c_user = null; //cookie from www.facebook.com
    this.datr = null; //cookie from www.facebook.com
    this.xs = null; //cookie from www.facebook.com
    this.agent = null; //connection agent
    this.debug = 1;
    this.server = 'wss://web-live-v3-0.agario.miniclippt.com/ws'; //todo doc

    this.ws = null;
  }

  log(text) {
    if (this.name) {
      console.log('Account(' + this.name + '): ' + text);
    } else {
      console.log('Account: ' + text);
    }
  }

  requestFBToken(cb) {
    var account = this;

    if (this.debug >= 1) {
      if (!this.c_user) this.log('[warning] You did not specified Account.c_user');
      if (!this.datr) this.log('[warning] You did not specified Account.datr');
      if (!this.xs) this.log('[warning] You did not specified Account.xs');
    }

    var ret = {
      error: null,
      res: null,
      data: null,
    };

    var cUser = this.c_user;
    var datr = this.datr;
    var xs = this.xs;

    //Some users don't decode their cookies, so let's try do it here
    if (cUser && cUser.indexOf('%')) cUser = decodeURIComponent(cUser);
    if (datr && datr.indexOf('%')) datr = decodeURIComponent(datr);
    if (xs && xs.indexOf('%')) xs = decodeURIComponent(xs);

    var cookies = 'c_user=' + encodeURIComponent(cUser) + ';' +
      'datr=' + encodeURIComponent(datr) + ';' +
      'xs=' + encodeURIComponent(xs) + ';';

    var options = {
      host: 'www.facebook.com',
      path: '/dialog/oauth?client_id=' + agarClientId + '&redirect_uri=https://agar.io&scope=public_profile,%20email&response_type=token',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Cookie: cookies,
      },
      agent: this.agent || null,
    };

    var req = https.request(options, function(res) {
      var data = '';
      ret.res = res;

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        ret.data = data;

        if (res && res.headers && res.headers.location) {
          res.headers.location.replace(/access_token=([a-zA-Z0-9-_]*)&/, function(_, parsed_token) {
            if (parsed_token) {
              account.token = parsed_token;
              account.token_provider = 1;
            }
          });
          res.headers.location.replace(/expires_in=([0-9]*)/, function(_, expire) {
            if (expire) {
              account.token_expire = Date.now() + expire * 1000;
            }
          });
        }

        if (cb) cb(account.token, ret);
      });
    });

    req.on('error', function(e) {
      ret.error = e;
      if (cb) cb(null, ret);
    });

    req.end();
  }
}
