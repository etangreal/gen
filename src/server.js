
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var	express 	= require('express'),
	bodyParser  = require('body-parser'),
	http 		= require('http'),
	ws 			= require('ws'),
	app 		= express();

var sock 		= require('./server/sock');

// ------------------------------------------------------------------------------------------------
// INITITIALIZE
// ------------------------------------------------------------------------------------------------

app.use( express.static(__dirname + '/public') );
app.use( bodyParser.json() );		// to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ 	// to support URL-encoded bodies
  extended: true
}));

// --------------------------------------------------------------------------------------------

require('./server/routes')(app);
require('./server/rest')(app);

// --------------------------------------------------------------------------------------------

app.use(function(req, res, next) {  
  res.send(404, 'Sorry cant find that!');
});

// --------------------------------------------------------------------------------------------

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// ------------------------------------------------------------------------------------------------
// SERVERS
// ------------------------------------------------------------------------------------------------

console.log('starting http & websocket servers');

var httpServer 		= http.createServer(app);
var webSocketServer = ws.createServer({server: httpServer});

webSocketServer.on('connection', sock.onConnect.bind(webSocketServer));

httpServer.listen(8080, function () { //onStartup
	var httpServer = this;

	var host = httpServer.address().address;
	var port = httpServer.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
}.bind(httpServer));

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
