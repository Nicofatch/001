var express = require('express');
var spot = require('./api/spot');
var fs = require('fs');
var app = express();
app.use(express.logger());

app.use(express.methodOverride());

app.use(express.bodyParser());

// ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

app.use("/css", express.static(__dirname + '/../css'));
app.use("/fonts", express.static(__dirname + '/../fonts'));
app.use("/js", express.static(__dirname + '/../js'));

app.get('/', function(request, response) {
    var html = fs.readFileSync('./index.html').toString()
    response.send(html);
});

//API
app.get('/api/spots',spot.findAll);
app.get('/api/spots/:id',spot.findById);
app.post('/api/spots',spot.add);
app.put('/api/spots/:id',spot.update);
app.delete('/api/spots/:id',spot.delete);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
