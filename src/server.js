
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var	express 	= require('express'),
	bodyParser  = require('body-parser'),
	http 		= require('http'),
	ws 			= require('ws');

	app 		= express(),
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
// REST ENDPOINTS
// ------------------------------------------------------------------------------------------------

app.param('token', function(req, res, next, token) {
	req.token = token;
	next();
});

// ------------------------------------------------------------------------------------------------

app.post('/user/greet/:token?', function(req, res) {
	res.json( app.rest.greet(req.body, req.token) );
});

// ------------------------------------------------------------------------------------------------

app.post('/user/handshake/:token?', function(req, res) { 
	res.json( app.rest.handshake(req.body, req.token ) );
});

// ------------------------------------------------------------------------------------------------
// ROUTES
// ------------------------------------------------------------------------------------------------

app.get('/', function(req, res) {
	console.log("app.get '/'", "redirecting to index.html" );
	res.redirect('http://localhost:8080/index.html');
});

// ------------------------------------------------------------------------------------------------

app.get('/test', function(req, res) {
	console.log("app.get '/test", "redirecting to test.html");
	res.redirect('http://localhost:8080/test.html');
});

// ------------------------------------------------------------------------------------------------
// ROUTE ERRORS
// ------------------------------------------------------------------------------------------------

app.use(function(req, res, next) {  
  res.send(404, 'Sorry cant find that!');
});

// ------------------------------------------------------------------------------------------------

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
