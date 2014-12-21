
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// CONTEXT
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

var context = (function(context) {

	// --------------------------------------------------------------------------------------------
	// CHECKS
	// --------------------------------------------------------------------------------------------

	if (!context.app) 		throw('rest.js (server) | app undefined.');

	// --------------------------------------------------------------------------------------------
	// APP
	// --------------------------------------------------------------------------------------------

	var app 	 	= context.app 	|| {};
		app.util 	= app.util 		|| exports && new exports.Util();
		app.store 	= app.store 	|| exports && new exports.Store();

	// --------------------------------------------------------------------------------------------
	// UI
	// --------------------------------------------------------------------------------------------

	var ui = context.ui || {

		/**
		 * A jQuery object of HTML element id='status'
		 *
		 * @method $status
		 * @return {Object} A jQuery object for #status
		 *
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
		 *
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
		 * Displays the status in the console and on the page using the element with id='status'.
		 *
		 * @method status
		 *
		 * @param {String} prefix The message prefix which will only be printed if it contains text.
		 * @param {String} msg The message (which will only be printed if it contains text)
		 *
		 * @return
		 */

		status: function(prefix, msg) {

			var $status =  ui.$status(),
				 html 	= $status.html();
				 prefix	=  prefix || '';
				 msg 	=  msg || '';

			console.log('STATUS:', prefix, msg);

			html = (html == '&nbsp;') ? '' : html + '<br /> ' ;
			html += prefix + ' ' + msg;

			$status.html(html);

		},//STATUS

	}//UI

	// --------------------------------------------------------------------------------------------
	// CONFIG
	// --------------------------------------------------------------------------------------------

	/**
	 * Configuration data for Rest
	 * 
	 * @property config
	 * @type Object
	 */

	var config = context.config || {

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

	}//CONFIG

	// --------------------------------------------------------------------------------------------
	// EXPORT (CONTEXT)
	// --------------------------------------------------------------------------------------------

	return {
		  $: context.$,
		app: app,
	exports: context.exports || {},
	 config: config,
		 ui: ui
	}

})(context || {
		  $: $,
		app: app || {},
	exports: (typeof exports !== 'undefined') ?
				exports :
				this['exports'] ?
					this['exports'] : 
					this['exports'] = {}
});

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// SOCK (CLIENT)
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

var app = (function(context) {

	// --------------------------------------------------------------------------------------------
	// CHECKS
	// --------------------------------------------------------------------------------------------

	if (!context) 			throw('rest.js | Context undefined!');
	if (!context.$) 		throw('rest.js | jQuery undefined!');
	if (!context.app) 		throw('rest.js | app undefined!');
	if (!context.exports) 	throw('rest.js | exports undefined!');
	if (!context.config)	throw('rest.js | config undefined!');
	if (!context.ui)		throw('rest.js | config undefined!');

	// --------------------------------------------------------------------------------------------
	// DECLARATIONS
	// --------------------------------------------------------------------------------------------

	var $ 		= context.$;
	var app 	= context.app;
	var util 	= app.util;
	var store 	= app.store;
	var exports = context.exports;
	var config  = context.config;
	var ui 		= context.ui;

	// --------------------------------------------------------------------------------------------
	// CHECKS
	// --------------------------------------------------------------------------------------------

	if (!util) 				throw('rest.js | util undefined!');
	if (!store) 			throw('rest.js | store undefined!');

	// --------------------------------------------------------------------------------------------
	// CLASS (SOCK)
	// --------------------------------------------------------------------------------------------

	/**
	 * A WebSocket API wrapper
	 *
	 * @class Sock
	 * @constructor
	 *
	 */

	function Sock() {

	}

	// --------------------------------------------------------------------------------------------
	// PRIVATE
	// --------------------------------------------------------------------------------------------

	var me = {

		// ----------------------------------------------------------------------------------------
		// PROPERTIES
		// ----------------------------------------------------------------------------------------

		ws: null,

		// ----------------------------------------------------------------------------------------
		// METHODS (WEBSOCKET)
		// ----------------------------------------------------------------------------------------

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
			ui.status('(WebSocket): Connecting...');

			if (me.ws) { //if there is an open websocket
				ui.status('(WebSocket): Closing previous connection...')
				me.ws.close();
			}

			//open a web socket
			me.ws 		 	= new WebSocket(host);
			me.ws.onopen 	= me.onOpen;
			me.ws.onmessage = me.onMessage;
			me.ws.onclose 	= me.onClose;
			me.ws.onerror 	= me.onError;
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
			if (!me.ws) {
				ui.status('(WebSocket): No connection!');
				return;
			}

			var pkg = util.pack(msg);
			me.ws.send(pkg);

			ui.status('(WebSocket): Message sent...', pkg);
		},

		/**
		 * Close the current websocket connection to the server
		 *
		 * @method close
		 *
		 * @return
		 */

		close: function() {
			if (!ms.ws) {
				ui.status('(WebSocket): is already closed.');				
				return;
			}

			ui.status('(WebSocket): Closing...');
			me.ws.close();
			me.ws = null;
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
			var $name = ui.$name();

			ui.status('(WebSocket): Connection opened...');
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
			var msg = util.unpack(pkg);

			if (msg.error) {
				ui.status('(WebSocket): Message received... however there was an ERROR in unpacking the message.', msg.error);
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
			ui.status('(WebSocket): Connection closed...');
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
			ui.status('(WebSocket): Connection error...' + err.message);
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
				case config.greetEndpoint:
					me.onGreetReceived(msg, pkg);
					break;
				case config.handshakeEndpoint:
					me.onHandshakeReceived(msg, pkg);
					break;
				default:
					me.unknownMessageReceived(msg, pkg);
			}

		},//ROUTE

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
			ui.status('(WebSocket): UNKNOWN MESSAGE RECIEVED from Server... ', pkg);
		},

		// ----------------------------------------------------------------------------------------
		// GREET
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
			ui.status('(WebSocket): SENDING GREET...');

			me.send({
				  msg: 'hello',
			 endpoint: config.greetEndpoint,
				token: store.getToken(),
				error: null
			});
		},

		/**
		 * API: The route function will route any replied 'greeting' received from the server to this function.
		 *
		 * @method onGreetReceived
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

		onGreetReceived: function(msg, pkg) {
			ui.status('(WebSocket): GREET RECIEVED from Server...', pkg);
		},

		// ----------------------------------------------------------------------------------------
		// HANDSHAKE
		// ----------------------------------------------------------------------------------------

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
			ui.status('(WebSocket): SENDING HANDSHAKE...');

			me.send({
				  msg: 'hello',
				 name: name,
			 endpoint: config.handshakeEndpoint,
				token: store.getToken(),
				error: null
			});
		},

		/**
		 * API: The route function will route any replied 'handshake' received from the server to this function.
		 *
		 * @method onHandshakeReceived
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

		onHandshakeReceived: function(msg, pkg) {
			var $token = ui.$token();

			ui.status('(WebSocket): HANDSHAKE RECIEVED from Server...', pkg);
			store.setToken(msg.token);
			$token.val(msg.token);
		}

	};//ME

	// --------------------------------------------------------------------------------------------
	// PUBLIC (CLASS PROTOTYPE)
	// --------------------------------------------------------------------------------------------

	Sock.prototype = {
		// WebSocket
		  connect: me.connect,
			close: me.close,
		// API
			greet: me.greet,
		handshake: me.handshake,
	}

	// --------------------------------------------------------------------------------------------
	// EXPORTS
	// --------------------------------------------------------------------------------------------

	exports.Sock = Sock;
	app.sock = app.sock || new Sock();

	return app;

})(context);

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------