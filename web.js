var express = require('express');
var fs = require('fs');
var app = express();
//app.use(express.logger());

app.use(function(req,res,next) {
    console.log('%s %s', req.method, req.url);
    next();
});

app.use("/css", express.static(__dirname + '/css'));
app.use("/fonts", express.static(__dirname + '/fonts'));
app.use("/js", express.static(__dirname + '/js'));

app.get('/', function(request, response) {
    var html = fs.readFileSync('./index.html').toString()
    response.send(html);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
