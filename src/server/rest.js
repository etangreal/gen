
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// CONTEXT
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

var context = (function(context) {

	// --------------------------------------------------------------------------------------------
	// CHECKS
	// --------------------------------------------------------------------------------------------

	// if (!context.exports) 		throw('rest.js (server) | exports undefined.');

	// --------------------------------------------------------------------------------------------
	// DECLARATIONS
	// --------------------------------------------------------------------------------------------

	var exports = context.exports 	|| module.exports;
	var uuid 	= context.uuid 		|| require('node-uuid');
	var util 	= context.util 		|| new (require('../public/js/util').Util)();
	var store 	= context.store 	|| new (require('./store').Store)();

	// --------------------------------------------------------------------------------------------
	// CONTEXT
	// --------------------------------------------------------------------------------------------

	return {
	 exports: exports,
		uuid: uuid,
		util: util,
	   store: store,
	}

})(context || {});

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// REST (SERVER)
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

(function(context) {
	//"use strict";

	// --------------------------------------------------------------------------------------------
	// CHECKS
	// --------------------------------------------------------------------------------------------

	if (!context) 			throw('rest.js | no context!');
	if (!context.exports) 	throw('rest.js | no exports!');
	if (!context.uuid) 		throw('rest.js | uuid is not defined!');
	if (!context.util)		throw('rest.js | util is not defined!');
	if (!context.store)		throw('rest.js | store is not defined!');

	// --------------------------------------------------------------------------------------------
	// DECLARATIONS
	// --------------------------------------------------------------------------------------------

	var exports = context.exports;
	var uuid 	= context.uuid;
	var util 	= context.util
	var store 	= context.store;

	// --------------------------------------------------------------------------------------------
	// CLASS
	// --------------------------------------------------------------------------------------------

	/**
	 * Provides API for connecting to the RESTful Web Services
	 *
	 * @class Rest
	 * @constructor
	 *
	 */

	function Rest() {

	}

	// --------------------------------------------------------------------------------------------
	// PRIVATE
	// --------------------------------------------------------------------------------------------

	var me = {

		// ----------------------------------------------------------------------------------------
		// METHODS
		// ----------------------------------------------------------------------------------------

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

		status: function(prefix, msg) {
			console.log(prefix);

			if (msg && msg !== '')
				console.log(' --->', msg);
		},

		// ----------------------------------------------------------------------------------------
		// API
		// ----------------------------------------------------------------------------------------

		/**
		 * A REST endpoint for exchanging a greeting.
		 *	The client will greet the server for two reasons:
		 *		1) See if the server is available
		 *		2) See if the server recognizes the client
		 *
		 * @method greet
		 *
		 * @param {Object} msg
		 *	A handshake message which contains: {
	  	 *		 msg (String): The message, which is mainly for logging
	 	 *		name (String): Name of the client
	  	 *	endpoint (String): The URI for this endpoint (unnecessary for REST, used with WebSockets)
	 	 *		type (String): Can either be 'request' or 'response'
	 	 *	   token (String): Uniquely identifies a client
	 	 *	   error (String): If there is any error this property will contain the message, otherwise null.
		 * 	}
		 *
		 * @param {String} token
		 *	(optional): A token which uniquely identifies a client
		 *
		 * @return {Object}
		 */

		greet: function(msg, token) {
			me.status('(WebSocket): GREET received...', msg);

			var name = store.find( token );

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

			me.status('(WebSocket): Replying to GREET ...', util.pack(reply));
			return reply;
		},

		/**
		 * Handles a the REST endpoint for exchanging a handshake.
		 *	The client handshake with the server in order to:
		 *		1) Register its name & token
		 *		2) If the client does not have a token, the server will generate one and return it to the client
		 *
		 * @method handshake
		 *
		 * @param {Object} msg 
		 *	A handshake message which contains: {
	  	 *		 msg (String): The message, which is mainly for logging
	 	 *		name (String): Name of the client
	  	 *	endpoint (String): The URI for this endpoint (unnecessary for REST, used with WebSockets)
	 	 *		type (String): Can either be 'request' or 'response'
	 	 *	   token (String): Uniquely identifies a client
	 	 *	   error (String): If there is any error this property will contain the message, otherwise null.
		 * 	}
		 *
		 * @return {Object}
		 */

		handshake: function(msg, token) {
			me.status('(RESTful): HANDSHAKE received...', msg);

			var name = store.find( token );
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

			me.status('(WebSocket): Replying to HANDSHAKE ...', util.pack(reply));
			return reply
		}

	}//me

	// --------------------------------------------------------------------------------------------
	// PUBLIC (CLASS PROTOTYPE)
	// --------------------------------------------------------------------------------------------

	Rest.prototype = {
			greet: me.greet,
		handshake: me.handshake,
	}//Rest.prototype

	// --------------------------------------------------------------------------------------------
	// EXPORTS
	// --------------------------------------------------------------------------------------------

	exports.Rest = Rest;

})(context);

/* ------------------------------------------------------------------------------------------------
## (DOCUMENTATION)
## ------------------------------------------------------------------------------------------------

	Inheritance
		developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_Revisited

	Module-Pattern
		adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

	BOOK
		JavaScript: The good Parts

## ------------------------------------------------------------------------------------------------
## END
## --------------------------------------------------------------------------------------------- */

