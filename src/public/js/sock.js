
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var util = window.exports.Util;
var store = window.exports.Storage;

// ------------------------------------------------------------------------------------------------
// CONSTRUCTOR
// ------------------------------------------------------------------------------------------------

	/**
	 * A WebSocket wrapper + API
	 *
	 * @class Sock
	 * @constructor
	 */
	function Sock() {
		var self = this;

		self._isConnected = false;
		self._ws = null;
	}

	Sock.prototype.constructor = Sock;

// ------------------------------------------------------------------------------------------------
// METHODS
// ------------------------------------------------------------------------------------------------

/**
 * Establishes a websocket connection to the server
 *
 * @method connect
 * @param {String} host The host url that the websocket will connect to. e.g. 'ws://localhost:8080/'
 * @return
 */

Sock.prototype.connect = function(host) {
	var self = this;
	self.status('(WebSocket): Connecting...');

	//open a web socket
	var ws 		 = new WebSocket(host);
	ws.onopen 	 = self.onOpen.bind(self);
	ws.onmessage = self.onMessage.bind(self);
	ws.onclose 	 = self.onClose.bind(self);
	ws.onerror 	 = self.onError.bind(self);
	self._ws 	 = ws;
}

/**
 * Close the current websocket connection to the server
 *
 * @method close
 * @return
 */

Sock.prototype.close = function() {
	var self = this;
	self.status('(WebSocket): Closing...');
	self._ws.close();
}

/**
 * Sends a message over the websocket connection to the server
 *
 * @method send
 * @param {String} msg The message to be sent. Formatted as JSON object.
 * @return
 */

Sock.prototype.send = function(msg) {
	var self = this;

	if (!self._isConnected) {
		self.status('(WebSocket): No connection!');
		return;
	}

	var pkg = util.pack(msg);
	self._ws.send(pkg);

	self.status('(WebSocket): Message sent...', pkg);
}

/**
 * Outputs the status to html(#status) and to the console
 *
 * @method status
 * @param {String} prefix The status message prefix. If blank (i.e. '') or 
 * null/undefined it will not be printed.
 * @param {String} msg The message object (in JSON format) that was sent/recieved. 
 * If null/undefined it will not be printed.
 * @return
 */

Sock.prototype.status = function(prefix, msg) {
	// var self = this;
	if (prefix !== '')
		console.log(prefix);

	if (msg && msg !== '')
		console.log(' ---> ', msg);

	var html = $('#status').html();
	html = (html == '&nbsp;') ? "" : html ;

	if (prefix && prefix !== '')
		html += "<br />" + prefix;

	if (msg && msg !== '')
		html += "<br /> ---> " + msg;

	$('#status').html(html);
}

// ------------------------------------------------------------------------------------------------
// ROUTING (INCOMING MESSAGES)
// ------------------------------------------------------------------------------------------------

/**
 * Routes the incomming message to the appropriate handler function
 *
 * @method route
 * @param {String} msg The message object (in JSON format) that was sent/recieved. 
 * If null/undefined it will not be printed.
 * @param {String} pkg The message object as string that represents a JSON object.
 * (i.e. JSON.Stringfy() was applied to it).
 * If null/undefined it will not be printed.
 * @return
 */

Sock.prototype.route = function(msg, pkg) {
	var self = this;

	if (!msg || !msg.endpoint) {
		self.unknownMessageReceived(msg, pkg);
		return;
	}

	switch(msg.endpoint) {
		case '/user/greet':
			self.greetReceived(msg, pkg);
			break;
		case '/user/handshake':
			self.handshakeReceived(msg, pkg);
			break;
		default:
			self.unknownMessageReceived(msg, pkg);
	}

},//route

/**
 * The route function passes unknown messages to this function. 
 *
 * @method unknownMessageReceived
 * @param {String} msg The message object (in JSON format) that was sent/recieved. 
 * If null/undefined it will not be printed.
 * @param {String} pkg The message object as string that represents a JSON object.
 * (i.e. JSON.Stringfy() was applied to it).
 * If null/undefined it will not be printed.
 * @return
 */

Sock.prototype.unknownMessageReceived = function(msg, pkg) {
	self.status('(WebSocket): UNKNOWN MESSAGE RECIEVED from Server... ', pkg);
};

// ------------------------------------------------------------------------------------------------
// API
// ------------------------------------------------------------------------------------------------

/**
 * API: Sends a 'greeting' message to the server. The server will look at the token in the greeting
 * and either respond with a 'welcome' message or 'unidentified' message
 *
 * @method greet
 * @return
 */

Sock.prototype.greet = function() {
	var self = this;
	self.status('(WebSocket): SENDING GREET...');

	self.send({
		  msg: 'hello',
	 endpoint: '/user/greet',
		token: store.getToken(),
		error: null
	});
}

/**
 * API: The route function will route any replied 'greeting' received from the server to this function.
 *
 * @method greetReceived
 * @param {String} msg The message object (in JSON format) that was sent/recieved. 
 * If null/undefined it will not be printed.
 * @param {String} pkg The message object as string that represents a JSON object.
 * (i.e. JSON.Stringfy() was applied to it).
 * If null/undefined it will not be printed.
 * @return
 */

Sock.prototype.greetReceived = function(msg, pkg) {
	var self = this;
	self.status('(WebSocket): GREET RECIEVED from Server...', pkg);
}

/**
 * API: Sends a 'handshake' message to the server. 
 * The server will look at the name and token passed along in the handshake.
 * 	If the token is recognized, the token and name is resave to storage.
 * 	If no token was supplied by the client or the token was not identified the server will respond by 
 * 	generating a new token and then registering token and the name.
 * 	The server will send a reply message with the registered token to the client.
 *
 * @method handshake
 * @param {String} name The name of the client
 * @return
 */

Sock.prototype.handshake = function(name) {
	var self = this;
	self.status('(WebSocket): SENDING HANDSHAKE...');

	self.send({
		  msg: 'hello',
		 name: name,
	 endpoint: '/user/handshake',
		token: store.getToken(),
		error: null
	});
}

/**
 * API: The route function will route any replied 'handshake' received from the server to this function.
 *
 * @method handshakeReceived
 * @param {String} msg The message object (in JSON format) that was sent/recieved. 
 * If null/undefined it will not be printed.
 * @param {String} pkg The message object as string that represents a JSON object.
 * (i.e. JSON.Stringfy() was applied to it).
 * If null/undefined it will not be printed.
 * @return
 */

Sock.prototype.handshakeReceived = function(msg, pkg) {
	var self = this;
	self.status('(WebSocket): HANDSHAKE RECIEVED from Server...', pkg);

	store.setToken(msg.token);
	$('#token').val(msg.token);
}

// ------------------------------------------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------------------------------------------

/**
 * Fired when a the WebSocket connection is opened
 *
 * @event onOpen
 * @return
 */

Sock.prototype.onOpen = function() { // WebSocket: connected.
	var self = this;
	self.status('(WebSocket): Connection opened...');

	self._isConnected = true;

	self.handshake( $('#name').val() );
};

/**
 * Event is fired when a message is received
 *
 * @event onMessage
 * @return
 */

Sock.prototype.onMessage = function (MsgEvt) { // WebSocket: message received.
	var self = this;

	var pkg = MsgEvt.data;
	var msg = util.unpack(pkg);

	if (msg.error) {
		self.status('(WebSocket): Message received... however there was an ERROR in unpacking the message.', msg.error);
		return;
	}

	self.route(msg, pkg);
};

/**
 * Event is fired when the websocket is closed
 *
 * @event onClose
 * @return
 */

Sock.prototype.onClose = function() { // WebSocket: closed.
	var self = this;
	self.status('(WebSocket): Connection closed...');
};

// ------------------------------------------------------------------------------------------------

/**
 * Fired when a websocket error occurs...
 *
 * @event onError
 * @return
 */

Sock.prototype.onError = function(err) { // WebSocket: error occured.
	var self = this;
	self.status('(WebSocket): Connection error...');
	console.log('WebSocket ERROR: ' + err.message);
}

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------