
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var	express 	= require('express'),
	bodyParser  = require('body-parser'),
	http 		= require('http'),
	ws 			= require('ws');

	app 		= express(), //	Declared Globally
	app.sock 	= new (require('./server/sock').Sock)();
	app.rest 	= new (require('./server/rest').Rest)();

// ------------------------------------------------------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------------------------------------------------------

app.use( express.static(__dirname + '/public') );

app.use( bodyParser.json() );		// to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ 	// to support URL-encoded bodies
  extended: true
}));

// ------------------------------------------------------------------------------------------------
// ENDPOINTS/ROUTES
// ------------------------------------------------------------------------------------------------

require('./server/endpoints')(app);
require('./server/routes')(app);

// ------------------------------------------------------------------------------------------------
// SERVERS
// ------------------------------------------------------------------------------------------------

console.log('starting http & websocket servers');

var httpServer 		= http.createServer(app);
var webSocketServer = ws.createServer({server: httpServer});

webSocketServer.on('connection', app.sock.onConnect.bind(webSocketServer));

httpServer.listen(8080, function () { //onStartup
	var httpServer = this;

	var host = httpServer.address().address;
	var port = httpServer.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
}.bind(httpServer));

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
