
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var uuid 	= require('node-uuid');

var util 	= require('../public/js/util').Util;
var store 	= require('./storage');

// ------------------------------------------------------------------------------------------------
// ENDPOINTS
// ------------------------------------------------------------------------------------------------

module.exports = function(app) {

	// --------------------------------------------------------------------------------------------
	// functions
	// --------------------------------------------------------------------------------------------

	var status = function(prefix, msg) {
		console.log(prefix);

		if (msg && msg !== '')
			console.log(' --->', msg);
	};

	// --------------------------------------------------------------------------------------------
	// paramenters
	// --------------------------------------------------------------------------------------------

	app.param('token', function(req, res, next, token) {
		req.token = token;
		next();
	});

	// --------------------------------------------------------------------------------------------
	// RESTful endpoints
	// --------------------------------------------------------------------------------------------

	app.post('/user/greet/:token?', function(req, res) {
		status('(WebSocket): GREET received...', req.body);

		var msg = req.body;
		var name = store.find( req.token );

		var hello = "Hello, sorry if I've forgotten - what is your name again?";
		if (name) 
			hello = "Hello " + name + "!";

		var reply = {
			  msg: hello,
		 endpoint: '/user/greet',
			token: msg.token,
			error: null
		}

		status('(WebSocket): Replying to GREET ...', util.pack(reply));
		res.json(reply);

	});

	// --------------------------------------------------------------------------------------------

	app.post('/user/handshake/:token?', function(req, res) {
		status('(RESTful): HANDSHAKE received...', req.body);

		var msg = req.body;
		var name = store.find( req.token );
		var token = name ? msg.token : uuid.v1();

		if (!name)
			store.add(token, msg.name);

		var hello = 'Hello ' + msg.name + '!';
			hello += name ?  ' welcome back!' : ' please to meet you :)';

		var reply = {
			  msg: hello,
		 endpoint: '/user/handshake',
			token: token,
			error: null
		}

		status('(WebSocket): Replying to HANDSHAKE ...', util.pack(reply));
		res.json(reply);
	});

	// --------------------------------------------------------------------------------------------

};//module.export

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
