var express = require('express');

var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
app.get('/', function(req, res, next) {
  //Path to your main file
  //res.status(200).sendFile(path.join(__dirname+'./index.html')); 
  app.use("/", express.static(__dirname));
});

app.listen(3000);
console.log("Running at Port 3000");

module.exports = app;