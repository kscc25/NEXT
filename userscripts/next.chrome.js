// ==UserScript==
// @name         NEXT
// @description  The next generation of Agar.io extension
// @version      0.0.1
// @author       NEXT
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==
window.stop(), document.documentElement.innerHTML = null, GM_xmlhttpRequest({
  method: "GET",
  url: "http://localhost:8080/",
  onload: function(e) {
    document.open(), document.write(e.responseText), document.close()
  }
});
