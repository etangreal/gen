
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var	express 	= require('express'),
	bodyParser  = require('body-parser'),
	http 		= require('http'),
	ws 			= require('ws'),
	app 		= express();

var sock 		= require('./server/sock'),
	httpd 		= require('./server/httpd');

// ------------------------------------------------------------------------------------------------
// INITITIALIZE
// ------------------------------------------------------------------------------------------------

app.use( express.static(__dirname + '/public') );
app.use( bodyParser.json() );

// --------------------------------------------------------------------------------------------

require('./server/routes')(app);
require('./server/endpoints')(app);

// --------------------------------------------------------------------------------------------

app.use(function(req, res, next){
  // res.status(404).body('Sorry cant find that!');
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
httpServer.listen(8080, httpd.onStart.bind(httpServer));

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
