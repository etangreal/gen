
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var	http 		= require('http'),
	ws 			= require('ws'),
	express 	= require('express'),
	bodyParser  = require('body-parser'),
	app 		= express();

var wsd 		= require('./wsd'),
	httpd 		= require('./httpd');

// ------------------------------------------------------------------------------------------------
// INITITIALIZE
// ------------------------------------------------------------------------------------------------

require('./pre-route')(express, app);
require('./routes')(app);
require('./endpoints')(app);
require('./post-route')(express, app);

// ------------------------------------------------------------------------------------------------
// SERVERS
// ------------------------------------------------------------------------------------------------
console.log('starting http & websocket servers');

var httpServer 		= http.createServer(app);
var webSocketServer = ws.createServer({server: httpServer});

webSocketServer.on('connection', wsd.onConnect.bind(webSocketServer));
httpServer.listen(8080, httpd.onStart.bind(httpServer));

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
