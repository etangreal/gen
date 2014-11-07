
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

	send: function(msg) {
		var pkg = util.pack(msg);
		self._ws.send(pkg);

		self.status('(WebSocket): Message SENT...', pkg);
	},

	// --------------------------------------------------------------------------------------------

	status: function(prefix, msg) {
		console.log(prefix);

		if (msg && msg !== '')
			console.log(' --->', msg);
	},

	// --------------------------------------------------------------------------------------------
	// ROUTE INCOMING MESSAGE
	// --------------------------------------------------------------------------------------------

	route: function(msg) {

		if (!msg || !msg.endpoint) {
			self.unknownMessage(msg);
			return;
		}

		switch(msg.endpoint) {
			case '/user/handshake':
				self.user.handshake(msg);
				break;
			default:
				self.unknownMessage(msg);
		}

	},//route

	// --------------------------------------------------------------------------------------------

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

		// ----------------------------------------------------------------------------------------

		handshake: function(msg) {
			self.status('(WebSocket): HANDSHAKE recieved...');

			var name = store.find( msg.token );
			var token = name ? msg.token : uuid.v1();

			if(!name) 
				store.add(token, msg.msg);

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

	}, //user

	// --------------------------------------------------------------------------------------------
	// EVENTS
	// --------------------------------------------------------------------------------------------

	onConnect: function(ws) { //ws: WebSocket
		self.status('(WebSocket): Client Connected...');
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

		self.status('(WebSocket): Message Recieved...', pkg);
		self.route(msg);   
	},

	// --------------------------------------------------------------------------------------------

	onError: function(err) {
		self.status('(WebSocket): Connection Error...', err.message);
	},

	// --------------------------------------------------------------------------------------------

	onClose: function() {
		self.status('(WebSocket): Connection Closed...', '');
	}

	// --------------------------------------------------------------------------------------------

};//module.exports

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
