
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
		self._ws.send(pkg);

		self.status('Websocket: Message sent...', pkg);
	},

	// --------------------------------------------------------------------------------------------

	status: function(prefix, msg) {
		console.log(prefix);

		if (msg && msg !== '')
			console.log(msg);
	},

	// --------------------------------------------------------------------------------------------
	// ROUTING
	// --------------------------------------------------------------------------------------------

	route: function(msg) {

		if (!msg || !msg.endpoint) {
			self.unknown(msg);
			return;
		}

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
			self.status('WebSocket: REGISTER request recieved...');

			var name = msg.msg;
			var token = uuid.v1();

			var reply = {
				  msg: name,
			 endpoint: '/user/register',
				token: token,
				error: null
			};

			self.send(reply);
		},

		// ----------------------------------------------------------------------------------------

		greet: function(msg) {
			self.status('WebSocket: GREET recieved...');

			var reply = {
				  msg: 'hi',
			 endpoint: '/user/greet',
				token: null,
				error: null
			};

			self.send(reply);
		},

		// ----------------------------------------------------------------------------------------

		ping: function(msg) {
			self.status('WebSocket: PING recieved...');

			var reply = {
				  msg: 'pong',
			 endpoint: '/user/ping',
				token: null,
				error: null
			};

			self.send(reply);
		}

	}, //user

	// --------------------------------------------------------------------------------------------

	unknown: function(msg) {
		self.status('WebSocket: UNKNOWN message from Client... ');

			var reply = {
				  msg: 'Unknown message',
			 endpoint: '/unknown',
				token: null,
				error: null
			};

		self.send(reply);
	},

	// --------------------------------------------------------------------------------------------
	// EVENTS
	// --------------------------------------------------------------------------------------------

	onConnect: function(ws) { //ws: WebSocket
		self.status('WebSocket: Client Connected...');
		self._ws = ws;

		var id = null; //= self.poll(ws);
		ws.onmessage = self.onMessage.bind({ws:ws});
		ws.onclose 	 = self.onClose.bind({id:id});
		ws.onerror 	 = self.onError.bind({id:id});
	},

	// --------------------------------------------------------------------------------------------

	onMessage: function(MsgEvt) { // Listen for msgs from the client
		var pkg = MsgEvt.data
		var msg = util.unpack(pkg);

		self.status('Websocket: Message Recieved...', msg);
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
