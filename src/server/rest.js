	
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
	// Functions
	// --------------------------------------------------------------------------------------------

	/**
	 * Displays the status in the console
	 *
	 * @method status
	 *
	 * @param {String} prefix The message prefix (which will only be ouput to the console if it contains text).
	 * @param {String} msg The message (which will only be output to the console if it contains text).
	 *
	 * @return
	 */

	var status = function(prefix, msg) {
		console.log(prefix);

		if (msg && msg !== '')
			console.log(' --->', msg);
	};

	// --------------------------------------------------------------------------------------------
	// Paramenters
	// --------------------------------------------------------------------------------------------

	/**
	 * Intercepts REST requests which contain the ':token' parameter. If the token is found it will
	 *	be attached diretly to the request object. i.e. 'req.token = token'.
	 * 
	 * @event param 'token'
	 * 
	 * @param {String} token (optional): A token which uniquely identifies a client
	 * 
	 * @return
	 */

	app.param('token', function(req, res, next, token) {
		req.token = token;
		next();
	});

	// --------------------------------------------------------------------------------------------
	// RESTful endpoints
	// --------------------------------------------------------------------------------------------

	/**
	 * A REST endpoint for exchanging a greeting.
	 *	The client will greet the server for two reasons:
	 *		1) To see if the server is available
	 *		2) To server if the server recognizes the client
	 * 
	 * @method post '/user/greet/:token?'
	 * 
	 * @param {String} token (optional): A token which uniquely identifies a client
	 * @param {Object} A handshake message which contains: {
	 * 	msg(String): The message, mainly unimportant, in this case simply 'hello'
	 *	name(String): Name of the client
	 * 	endpoint(String): The URI for this endpoint (unnecessary for REST, used with WebSockets)
	 *	type(String): Can either be 'request' or 'response'
	 *	token(String): Uniquely identifies a client
	 *	error(String): If there is any error this property will contain the message, otherwise null.
	 * }
	 * 
	 * @return {Object}
	 */

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
		 	 type: 'response',
			token: msg.token,
			error: null
		}

		status('(WebSocket): Replying to GREET ...', util.pack(reply));
		res.json(reply);
	});

	// --------------------------------------------------------------------------------------------

	/**
	 * A REST endpoint for exchanging a handshake.
	 *	The client handshake with the server in order to:
	 *		1) Give the server its name which the server will then register along with a uniquely generate token
	 *		2) 
	 *
	 * @method app.post '/user/handshake/:token?'
	 * 
	 * @param {String} token An optional token which uniquely identifies a client
	 * @param {Object} A handshake message which contains: {
	 * 	msg(String): The message, which is mainly for logging
	 *	name(String): Name of the client
	 * 	endpoint(String): The URI for this endpoint (unnecessary for REST, used with WebSockets)
	 *	type(String): Can either be 'request' or 'response'
	 *	token(String): Uniquely identifies a client
	 *	error(String): If there is any error this property will contain the message, otherwise null.
	 * }
	 * 
	 * @return {Object}
	 */

	app.post('/user/handshake/:token?', function(req, res) {
		status('(RESTful): HANDSHAKE received...', req.body);

		var msg = req.body;
		var name = store.find( msg.token );
		var token = name ? msg.token : uuid.v1();

		if (!name)
			store.add(token, msg.name);

		var hello = 'Hello ' + msg.name + '!';
			hello += name ? ' welcome back!' : ' please to meet you :)';

		var reply = {
			  msg: hello,
		 endpoint: '/user/handshake',
			token: token,
			error: null
		}

		status('(WebSocket): Replying to HANDSHAKE ...', util.pack(reply));
		res.json(reply);
	});

};//module.export

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
