
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var app 		= app || {};
	app.util 	= app.util || window.exports.Util;
	app.store 	= app.store || window.exports.Storage;

// ------------------------------------------------------------------------------------------------
// CLOSURE
// ------------------------------------------------------------------------------------------------

(function(app, $) {

	// --------------------------------------------------------------------------------------------
	// CHECK PREREQUISITES
	// --------------------------------------------------------------------------------------------

	if (!app)
		throw('rest: object app not found.');

	if (!app.util)
		throw('rest.js: object app.util not found.');

	if(!app.store)
		throw('rest.js: object app.store not found.');

	// --------------------------------------------------------------------------------------------
	// PRIVATE
	// --------------------------------------------------------------------------------------------

	var _isConnected = false;
	var _ws = null;

	// --------------------------------------------------------------------------------------------
	// SOCK
	// --------------------------------------------------------------------------------------------

	/**
	 * A WebSocket wrapper + API
	 *
	 * @class Sock
	 * @constructor
	 */

	function Sock() {
		// var self = this;
	}

	// Sock.prototype.constructor = Sock;

	var me = Sock.prototype = {

		// ----------------------------------------------------------------------------------------
		// IMPORTS
		// ----------------------------------------------------------------------------------------

		/**
		 * IMPORTED: utility
		 * 
		 * @property util
		 # @type Object
		 */

		util: app.util,

		/**
		 * IMPORTED: storage
		 * 
		 * @property store
		 # @type Object
		 */

		store: app.store,

		// ----------------------------------------------------------------------------------------
		// CONFIG
		// ----------------------------------------------------------------------------------------

		/**
		 * Configuration data for Rest
		 * 
		 * @property config
		 # @type Object
		 */

		config: {

			/**
			 * A jQuery object of HTML element id='status'
			 *
			 * @method $status
			 * @return {Object} A jQuery object for #status
			 */

			$status: function() {
				try {
					return $('#status');
				} catch(e) {
					throw('Rest.config: Could not find #status. ' + e.message);
				}
			},

			/**
			 * A jQuery object of HTML element with id='token'
			 *
			 * @method $token
			 * @return {Object} A jQuery object for #token
			 */

			$token: function() {
				try {
					return $('#token');
				} catch(e) {
					throw('Rest.config: Could not find #token. ' + e.message);
				}
			},

			/**
			 * A jQuery object of HTML element with id='name'
			 *
			 * @method $name
			 * @return {Object} A jQuery object for #name
			 */

			$name: function() {
				try {
					return $('#name');
				} catch(e) {
					throw('Rest.config: Could not find #name. ' + e.message);
				}
			},

			/**
			 * Ajax datatype to be used
			 *
			 * @property dataType
			 * @type String
			 */

			dataType: 'json',

			/**
			 * The endpoint for the user/greet
			 *
			 * @property greetEndpoint
			 * @type String
			 */

			greetEndpoint: '/user/greet',

			/**
			 * The url for the user/greet endpoint
			 *
			 * @property greetUrl
			 * @type String
			 */

			greetUrl: 'http://localhost:8080/user/greet',

			/**
			 * The endpoint for the user/handshake
			 *
			 * @property handshakeUrl
			 * @type String
			 */

			handshakeUrl: 'http://localhost:8080/user/handshake',

			/**
			 * The url for the user/handshake endpoint
			 *
			 * @property handshakeUrl
			 * @type String
			 */

			handshakeEndpoint: '/user/handshake'

		},//config

		// ----------------------------------------------------------------------------------------
		// METHODS
		// ----------------------------------------------------------------------------------------

		/**
		 * Outputs the status to html(#status) and to the console
		 *
		 * @method status
		 *
		 * @param {String} prefix
		 *	The status message prefix. If blank (i.e. '') or 
		 * 	null/undefined it will not be printed.
		 *
		 * @param {String} msg
		 *	The message object (in JSON format) that was sent/recieved. 
		 * 	If null/undefined it will not be printed.
		 *
		 * @return
		 */

		status: function(prefix, msg) {
			if (!prefix) prefix = '';
			if (!msg) msg = '';

			console.log('STATUS:', prefix, msg);

			var $status   = me.config.$status(),
				 html 	  = $status.html();

			html = (html == '&nbsp;') ? '' : html + '<br /> ' ;
			html += prefix + ' ' + msg;

			$status.html(html);
		},

		/**
		 * Establishes a websocket connection to the server
		 *
		 * @method connect
		 *
		 * @param {String} host 
		 *	The host url that the websocket will connect to. e.g. 'ws://localhost:8080/'
		 *	
		 * @return
		 */

		connect: function(host) {
			me.status('(WebSocket): Connecting...');

			//open a web socket
			_ws 		 	= new WebSocket(host);
			_ws.onopen 	 	= me.onOpen.bind(self);
			_ws.onmessage 	= me.onMessage.bind(self);
			_ws.onclose 	= me.onClose.bind(self);
			_ws.onerror 	= me.onError.bind(self);
		},

		/**
		 * Sends a message over the websocket connection to the server
		 *
		 * @method send
		 *
		 * @param {String} msg 
		 *	The message to be sent. Formatted as JSON object.
		 *
		 * @return
		 */

		send: function(msg) {
			if (!_isConnected) {
				me.status('(WebSocket): No connection!');
				return;
			}

			var pkg = me.util.pack(msg);
			_ws.send(pkg);

			me.status('(WebSocket): Message sent...', pkg);
		},

		/**
		 * Close the current websocket connection to the server
		 *
		 * @method close
		 *
		 * @return
		 */

		close: function() {
			me.status('(WebSocket): Closing...');
			_ws.close();
		},

		// ----------------------------------------------------------------------------------------
		// ROUTING (of incoming messages)
		// ----------------------------------------------------------------------------------------

		/**
		 * Routes the incoming message to the appropriate handler function
		 *
		 * @method route
		 *
		 * @param {String} msg 
		 *	The message object (in JSON format) that was sent/recieved. 
		 * 	If null/undefined it will not be printed.
		 *
		 * @param {String} pkg 
		 *	The message object as string that represents a JSON object. (i.e. JSON.Stringfy() was applied to it).
		 *	If null/undefined it will not be printed.
		 * 
		 * @return
		 */

		route: function(msg, pkg) {
			if (!msg)
				me.unknownMessageReceived(msg, pkg);

			else

			switch(msg.endpoint) {
				case me.config.greetEndpoint:
					me.greetReceived(msg, pkg);
					break;
				case me.config.handshakeEndpoint:
					me.handshakeReceived(msg, pkg);
					break;
				default:
					me.unknownMessageReceived(msg, pkg);
			}

		},//route

		/**
		 * The route function passes unknown messages to this function for processing. 
		 *
		 * @method unknownMessageReceived
		 *
		 * @param {String} msg 
		 *	The message object (in JSON format) that was sent/recieved. 
		 * 	If null/undefined it will not be printed.
		 *
		 * @param {String} pkg 
		 *	The message object as string that represents a JSON object.
		 * 	(i.e. JSON.Stringfy() was applied to it).
		 * 	If null/undefined it will not be printed.
		 *
		 * @return
		 */

		unknownMessageReceived: function(msg, pkg) {
			me.status('(WebSocket): UNKNOWN MESSAGE RECIEVED from Server... ', pkg);
		},

		// ----------------------------------------------------------------------------------------
		// API
		// ----------------------------------------------------------------------------------------

		/**
		 * API: Sends a 'greeting' message to the server. The server will look at the token in the greeting
		 * 	and either respond with a 'welcome' message or 'unidentified' message
		 *
		 * @method greet
		 *
		 * @return
		 */

		greet: function() {
			me.status('(WebSocket): SENDING GREET...');

			me.send({
				  msg: 'hello',
			 endpoint: me.config.greetEndpoint,
				token: me.store.getToken(),
				error: null
			});
		},

		/**
		 * API: The route function will route any replied 'greeting' received from the server to this function.
		 *
		 * @method greetReceived
		 *
		 * @param {String} msg
		 *	The message object (in JSON format) that was sent/recieved. 
		 * 	If null/undefined it will not be printed.
		 *
		 * @param {String} pkg 
		 *	The message object as string that represents a JSON object. (i.e. JSON.Stringfy() was applied to it).
		 * 	If null/undefined it will not be printed.
		 *
		 * @return
		 */

		greetReceived: function(msg, pkg) {
			me.status('(WebSocket): GREET RECIEVED from Server...', pkg);
		},

		/**
		 * API: Sends a 'handshake' message to the server. 
		 * 	The server will look at the name and token passed along in the handshake.
		 * 	If the token is recognized, the token and name is resave to storage.
		 * 	If no token was supplied by the client or the token was not identified the server will respond by 
		 * 	generating a new token and then registering token and the name.
		 * 	The server will send a reply message with the registered token to the client.
		 *
		 * @method handshake
		 *
		 * @param {String} name 
		 *	The name of the client
		 *
		 * @return
		 */

		handshake: function(name) {
			me.status('(WebSocket): SENDING HANDSHAKE...');

			me.send({
				  msg: 'hello',
				 name: name,
			 endpoint: me.config.handshakeEndpoint,
				token: me.store.getToken(),
				error: null
			});
		},

		/**
		 * API: The route function will route any replied 'handshake' received from the server to this function.
		 *
		 * @method handshakeReceived
		 *
		 * @param {String} msg
		 *	The message object (in JSON format) that was sent/recieved. 
		 * 	If null/undefined it will not be printed.
		 *
		 * @param {String} pkg
		 *	The message object as string that represents a JSON object.
		 * 	(i.e. JSON.Stringfy() was applied to it).
		 * 	If null/undefined it will not be printed.
		 *
		 * @return
		 */

		handshakeReceived: function(msg, pkg) {
			var $token = me.config.$token();

			me.status('(WebSocket): HANDSHAKE RECIEVED from Server...', pkg);
			me.store.setToken(msg.token);
			$token.val( msg.token );
		},

		// ----------------------------------------------------------------------------------------
		// EVENTS
		// ----------------------------------------------------------------------------------------

		/**
		 * Fired when a the WebSocket connection is opened
		 *
		 * @event onOpen
		 *
		 * @return
		 */

		onOpen: function() { // WebSocket: connected.
			var $name = me.config.$name();

			me.status('(WebSocket): Connection opened...');
			_isConnected = true;
			me.handshake( $name.val() );
		},

		/**
		 * Event is fired when a message is received
		 *
		 * @event onMessage
		 *
		 * @return
		 */

		onMessage: function (MsgEvt) { // WebSocket: message received.
			var pkg = MsgEvt.data;
			var msg = me.util.unpack(pkg);

			if (msg.error) {
				me.status('(WebSocket): Message received... however there was an ERROR in unpacking the message.', msg.error);
				return;
			}

			me.route(msg, pkg);
		},

		/**
		 * Event is fired when the websocket is closed
		 *
		 * @event onClose
		 *
		 * @return
		 */

		onClose: function() { // WebSocket: closed.
			me.status('(WebSocket): Connection closed...');
		},

		/**
		 * Fired when a websocket error occurs...
		 *
		 * @event onError
		 *
		 * @return
		 */

		onError: function(err) { // WebSocket: error occured.
			// console.error('WebSocket ERROR: ' + err.message);
			me.status('(WebSocket): Connection error...' + err.message);
		}

	};//Sock.prototype

	// --------------------------------------------------------------------------------------------
	// EXPORT SOCK
	// --------------------------------------------------------------------------------------------

	app.sock = app.sock || new Sock();

})(app, $);

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------