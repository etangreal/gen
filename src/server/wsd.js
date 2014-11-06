
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var util = require('../public/js/util').Util;
var uuid = require('node-uuid');

// ------------------------------------------------------------------------------------------------
// MODULE
// ------------------------------------------------------------------------------------------------

var self = module.exports = {

	// --------------------------------------------------------------------------------------------
	// METHODS
	// --------------------------------------------------------------------------------------------

	send: function(msg) {
		var pkg = util.pack(msg);
		ws.send(pkg);
	},

	// --------------------------------------------------------------------------------------------

	status: function(prefix, msg) {
		console.log(prefix);

		if (msg && msg !== '')
			console.log('	MSG: ', msg);
	},

	// --------------------------------------------------------------------------------------------
	// ROUTING
	// --------------------------------------------------------------------------------------------

	route: function(msg) {

		switch(msg.endpoint) {
			case '/user/register':
				self.user.register(msg);
				break;
			case '/user/greet':
				self.user.greet(msg);
				break;
			case '/user/ping':
				self.user.ping(msg);
				break;
			default:
				self.unknown(msg);
		}

	},//route

	// --------------------------------------------------------------------------------------------
	// USER
	// --------------------------------------------------------------------------------------------

	user: {

		register: function(msg) {
			self.status('WebSocket: Client wants to REGISTER: ', msg);

			var reply = {
				  msg: 'token',
			 endpoint: '/user/register',
				token: uuid.v1(),
				error: null
			};

			self.status('WebSocket: Server replies to REGISTER request: ', reply);
			//self.send(reply);
		},

		// ----------------------------------------------------------------------------------------

		greet: function(msg) {
			self.status('WebSocket: Client GREETs: ', msg);

			var reply = {
				  msg: 'hi',
			 endpoint: '/user/greet',
				token: null,
				error: null
			};

			self.status('WebSocket: Server replies to GREETing: ', reply);
			//self.send(reply);
		},

		// ----------------------------------------------------------------------------------------

		ping: function(msg) {
			self.status('WebSocket: Client sends PING: ', msg);

			var reply = {
				  msg: 'pong',
			 endpoint: '/user/ping',
				token: null,
				error: null
			};

			self.status('WebSocket: Server replies to PING: ', reply);
			//self.send(reply);
		}

	}, //user

	// --------------------------------------------------------------------------------------------

	unknown: function(msg) {
		self.status('WebSocket: UNKNOWN message from Client: ', msg);

			var reply = {
				  msg: 'Unknown message',
			 endpoint: '/unknown',
				token: null,
				error: null
			};

		self.status('WebSocket: Server replies to UNKNOWN message from Client. ', reply);
		//self.send(reply);
	},

	// --------------------------------------------------------------------------------------------
	// EVENTS
	// --------------------------------------------------------------------------------------------

	onConnect: function(ws) { //ws: WebSocket
		self.status('WebSocket: Client connected...');

		var id = null; //= self.poll(ws);
		ws.onmessage = self.onMessage.bind({ws:ws});
		ws.onclose 	 = self.onClose.bind({id:id});
		ws.onerror 	 = self.onError.bind({id:id});
	},

	// --------------------------------------------------------------------------------------------

	onMessage: function(MsgEvt) { // Listen for msgs from the client
		self.status('Websocket: Message recieved...');

		var pkg = MsgEvt.data
		var msg = util.unpack(pkg);

		if (msg.error) {
			self.status('WebSocket: Message Error', msg);
			return;
		}

		self.route(msg);   
	},

	// --------------------------------------------------------------------------------------------

	onError: function(err) {
		self.status('WebSocket: Connection Error...', err.message);

		//ToDo: stop polling...
	},

	// --------------------------------------------------------------------------------------------

	onClose: function() {
		self.status('WebSocket: Connection Closed...', '');

		// self.status('Server: Stop Polling...');
		// clearInterval(this.id);
	}

	// --------------------------------------------------------------------------------------------
	// SERVICE
	// --------------------------------------------------------------------------------------------

	/** /
	poll: function(ws) {
		self.status('WebSocket: Started Polling...');

		var id = setInterval( function() {

			var msg = {
				  msg: Date.now(),
			 endpoint: '/user/poll',
				token: null,
				error: null
			};

			self.send(msg);
			self.status('Server: Polling... ', msg);

		}, 5000);

		return id;
	},//poll /**/

	// --------------------------------------------------------------------------------------------

};//module.exports

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
