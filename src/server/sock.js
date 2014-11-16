
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var uuid 	= require('node-uuid');

var util 	= require('../public/js/util').Util;
var store 	= require('./storage');

// ------------------------------------------------------------------------------------------------
// MODULE
// ------------------------------------------------------------------------------------------------

var self = module.exports = {

	// --------------------------------------------------------------------------------------------
	// METHODS
	// --------------------------------------------------------------------------------------------

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
		self._ws.send(pkg);

		self.status('(WebSocket): Message SENT...', pkg);
	},

	/**
	 * Sends a message through the websocket connection.
	 *
	 * @method status
	 *
	 * @param {String} prefix The message prefix, printed to the console if it is not empty/null.
	 * @param {String} msg The message, printed to the console if it is not empty/null.
	 *
	 * @return
	 */

	status: function(prefix, msg) {
		if (prefix && prefix !== '')
			console.log(prefix);

		if (msg && msg !== '')
			console.log(' --->', msg);
	},

	// --------------------------------------------------------------------------------------------
	// ROUTE (INCOMING MESSAGE)
	// --------------------------------------------------------------------------------------------

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

		if (!msg || !msg.endpoint) {
			self.unknownMessage(msg);
			return;
		}

		switch(msg.endpoint) {
			case '/user/greet':
				self.user.greet(msg);
				break;
			case '/user/handshake':
				self.user.handshake(msg);
				break;
			default:
				self.unknownMessage(msg);
		}

	},//route

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
		self.status('(WebSocket): UNKNOWN MESSAGE Received... ');

			var reply = {
				  msg: 'Unknown message: ' + msg.msg + ' with endpoint: ' + msg.endpoint,
			 endpoint: '/unknown',
				token: msg.token,
				error: null
			};

		self.send(reply);
	},

	// --------------------------------------------------------------------------------------------
	// API:USER
	// --------------------------------------------------------------------------------------------

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
			self.status('(WebSocket): GREET received...');

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

			self.send(reply);
		},

		/**
		 * When a handshake message is received via websocket, the function will handle it and send a reply
		 *
		 * @method handshake
		 *
		 * @param {Object} msg The message (JSON Object)
		 *
		 * @return
		 */

		handshake: function(msg) {
			self.status('(WebSocket): HANDSHAKE received...');

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

			self.send(reply);
		},

	},//user

	// --------------------------------------------------------------------------------------------
	// EVENTS
	// --------------------------------------------------------------------------------------------

	/**
	 * The onConnect event occurs when a client connects to the server
	 *
	 * @event onConnect
	 *
	 * @param {Object} ws The websocket object.
	 */

	onConnect: function(ws) { //ws: WebSocket
		self.status('(WebSocket): Client Connected...');
		self._ws = ws;

		var id = null; //= self.poll(ws);
		ws.onmessage = self.onMessage.bind({ws:ws});
		ws.onclose 	 = self.onClose.bind({id:id});
		ws.onerror 	 = self.onError.bind({id:id});
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
		var pkg = MsgEvt.data
		var msg = util.unpack(pkg);

		self.status('(WebSocket): Message Recieved...', pkg);
		self.route(msg);   
	},

	/**
	 * The onError event occurs when an error occurs while using the WebSocket connection
	 *
	 * @event onError
	 *
	 * @param {Object} err The Error object
	 */

	onError: function(err) {
		self.status('(WebSocket): Connection Error...', err.message);
	},

	/**
	 * The onClose event occurs when a client closes the WebSocket connection
	 *
	 * @event onClose
	 */

	onClose: function() {
		self.status('(WebSocket): Connection Closed...', '');
	}

};//module.exports


// ------------------------------------------------------------------------------------------------
// DOCUMENTATION
// ------------------------------------------------------------------------------------------------



// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
