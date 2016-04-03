// ==UserScript==
// @name         NEXT
// @description  The next generation of Agar.io extension
// @version      0.0.1
// @author       NEXT
// @match        http://agar.io/*
// @match        https://agar.io/*
// @downloadURL  http://snsa.github.io/NEXT/next.firefox.user.js
// @updateURL    http://snsa.github.io/NEXT/next.firefox.user.js
// @grant none
// ==/UserScript==

function opengradingwindow(htmlContent) {
  var element = document.createElement('script');
  var target = document.getElementsByTagName('head')[0] || (document.body || document.documentElement);
  element.type = 'text/javascript';
  element.textContent = '(function(html){var d=window.document;d.open();d.write(html);d.close();})(' + JSON.stringify(htmlContent) + ');';
  target.appendChild(element);
};

function replacePage(url) {
  if (!window.PIXI) {
    var req = new XMLHttpRequest;
    req.onreadystatechange = function() {
      if (4 == req.readyState) {
        if (200 == req.status) {
          document.documentElement.innerHTML = '<h1>Loading...<h1>';
          opengradingwindow(req.responseText);
        }
      }
    };
    req.open('GET', url, true);
    req.send();
  }
}
var sites = {
  '/': 'http://snsa.github.io/NEXT/',
  '/dev': 'http://localhost:8080/'
};
var pathname = location.pathname;
if (sites.hasOwnProperty(pathname)) {
  replacePage(sites[pathname]);
};
