// ==UserScript==
// @name         NEXT
// @description  The next generation of Agar.io extension
// @version      0.0.1
// @author       NEXT
// @match        http://agar.io/*
// @match        https://agar.io/*
// @downloadURL  http://snsa.github.io/NEXT/next.chrome.user.js
// @updateURL    http://snsa.github.io/NEXT/next.chrome.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==
window.stop();
document.documentElement.innerHTML = null;

var urlMaps = {
  '/': 'http://snsa.github.io/NEXT/',
  '/dev': 'http://localhost:8080/'
};

var url = urlMaps[location.pathname] || urlMaps['/'];

GM_xmlhttpRequest({
  method: 'GET',
  url: url,
  onload: function(e) {
    document.open(), document.write(e.responseText), document.close()
  }
});
