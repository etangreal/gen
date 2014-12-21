
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
// SOCK (SERVER)
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

(function(context) {

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
	 * @class Sock
	 * @constructor
	 *
	 */

	function Sock() {

	}

	var me = {

		// ----------------------------------------------------------------------------------------
		// PROPERTIES
		// ----------------------------------------------------------------------------------------

		/**
		 * The WebSocket
		 *
		 * @property ws
		 * @type Object
		 *
		 */

		ws: null,

		// ----------------------------------------------------------------------------------------
		// METHODS
		// ----------------------------------------------------------------------------------------

		/**
		 * Logs ouput to the console
		 *
		 * @method status
		 *
		 * @param {String} prefix The message prefix, printed to the console if it is not empty/null.
		 * @param {String} msg The message, printed to the console if it is not empty/null.
		 *
		 * @return
		 */

		status: function(prefix, msg) {
			prefix = prefix || '';
			msg = msg || '';

			console.log('STATUS:', prefix, msg);
		},

		/**
		 * Sends a message through the websocket connection.
		 *
		 * @method send
		 *
		 * @param {Object} msg The message (JSON object) that is to be sent.
		 *
		 * @return
		 */

		send: function(msg) {
			var pkg = util.pack(msg);
			me.ws.send(pkg);

			me.status('(WebSocket): Message SENT...', pkg);
		},

		// ----------------------------------------------------------------------------------------
		// EVENTS
		// ----------------------------------------------------------------------------------------

		/**
		 * The onConnect event occurs when a client connects to the server
		 *
		 * @event onConnect
		 *
		 * @param {Object} ws The websocket object.
		 */

		onConnect: function(ws) { //ws: WebSocket
			me.status('(WebSocket): Client Connected...');

			// if (me.ws) //if there is an open connection
				//ToDo: 

			me.ws 				= ws;
			me.ws.onmessage 	= me.onMessage;
			me.ws.onclose 	 	= me.onClose;
			me.ws.onerror 	 	= me.onError;
		},

		/**
		 * The onMessage event occurs when a message is received from a connected client
		 *
		 * @event onMessage
		 *
		 * @param {Object} MsgEvt The Message Event object, contains event info as well as any data
		 *	sent from the client. MsgEvt.data
		 */

		onMessage: function(MsgEvt) { // Listen for msgs from the client
			var pkg = MsgEvt.data;
			var msg = util.unpack(pkg);

			me.status('(WebSocket): Message Recieved...', pkg);
			me.route(msg);
		},

		/**
		 * The onError event occurs when an error occurs while using the WebSocket connection
		 *
		 * @event onError
		 *
		 * @param {Object} err The Error object
		 */

		onError: function(err) {
			me.status('(WebSocket): Connection Error...', err.message);
		},

		/**
		 * The onClose event occurs when a client closes the WebSocket connection
		 *
		 * @event onClose
		 */

		onClose: function() {
			me.status('(WebSocket): Connection Closed...');
		},

		// ----------------------------------------------------------------------------------------
		// ROUTE (INCOMING MESSAGE)
		// ----------------------------------------------------------------------------------------

		/**
		 * Routes a message to the appropriate handler function
		 *
		 * @method route
		 *
		 * @param {Object} msg The message (JSON Object) to be routed
		 *
		 * @return
		 */

		route: function(msg) {
			if (!msg)
				me.unknownMessage(msg);
			else
			switch(msg.endpoint) {
				case '/user/greet':
					me.user.greet(msg);
					break;
				case '/user/handshake':
					me.user.handshake(msg);
					break;
				default:
					me.unknownMessage(msg);
			}

		},//ROUTE

		/**
		 * Handles unknown messages
		 *
		 * @method unknownMessage
		 *
		 * @param {Object} msg The message (JSON Object) which has a unknown handler type.
		 *
		 * @return
		 */

		unknownMessage: function(msg) {
			me.status('(WebSocket): UNKNOWN MESSAGE Received... ');

			var reply = {
				  msg: 'Unknown message: ' + msg.msg + ' with endpoint: ' + msg.endpoint,
			 endpoint: '/unknown',
				token: msg.token,
				error: null
			};

			me.send(reply);
		},

		// ----------------------------------------------------------------------------------------
		// API (USER)
		// ----------------------------------------------------------------------------------------

		user: {

			/**
			 * When a GREETing message is received via websocket, the function will handle it and send a reply
			 *
			 * @method greet
			 *
			 * @param {Object} msg The message (JSON Object)
			 *
			 * @return
			 */

			greet: function(msg) {
				me.status('(WebSocket): GREET received...');

				var name = store.find( msg.token );

				var hello = "Hello, sorry if I've forgotten - what is your name again?";

				if (name) 
					hello = "Hello " + name + "!";

				var reply = {
					  msg: hello,
				 endpoint: '/user/greet',
				 	 type: 'response',
					token: msg.token,
					error: null
				};

				me.send(reply);
			},

			/**
			 * When a handshake message is received via websocket, the function will handle it and send a reply
			 *
			 * @method handshake
			 *
			 * @param {Object} msg The message (JSON Object)
			 *
			 * @return
			 *
			 */

			handshake: function(msg) {
				me.status('(WebSocket): HANDSHAKE received...');

				var name = store.find( msg.token );
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
				};

				me.send(reply);

			},//HANDSHAKE

		}//USER

	};//ME

	// --------------------------------------------------------------------------------------------
	// PUBLIC (CLASS PROTOTYPE)
	// --------------------------------------------------------------------------------------------

	Sock.prototype = {
		//WebSocket
		onConnect: me.onConnect,

		//API
		user: {
				greet: me.greet,
			handshake: me.handshake
		}//USER

	}//SOCK.PROTOTYPE

	// --------------------------------------------------------------------------------------------
	// EXPORTS
	// --------------------------------------------------------------------------------------------

	exports.Sock = Sock;

})(context);

/* ------------------------------------------------------------------------------------------------
## (DOCUMENTATION)
## ------------------------------------------------------------------------------------------------


## ------------------------------------------------------------------------------------------------
## END
## --------------------------------------------------------------------------------------------- */
