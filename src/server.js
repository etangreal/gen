
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

app.use( express.static(__dirname + '/public') );
app.use( bodyParser.json() );

// --------------------------------------------------------------------------------------------

require('./routes')(app);
require('./endpoints')(app);

// --------------------------------------------------------------------------------------------

app.use(function(req, res, next){
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

webSocketServer.on('connection', wsd.onConnect.bind(webSocketServer));
httpServer.listen(8080, httpd.onStart.bind(httpServer));

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
