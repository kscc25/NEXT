var express = require('express');
var app = express();

var host = "localhost";
var port = process.env.PORT || 8080;

app.use(express.static('public'));
app.use('/build', express.static('build'));

var server = app.listen(port, host, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);

});
