// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var util = window.exports.Util;
var store = window.exports.Storage;

// ------------------------------------------------------------------------------------------------
// CONSTRUCTOR
// ------------------------------------------------------------------------------------------------

	function Sock() {
		var self = this;

		self._isConnected = false;
		self._ws = null;
	}

	Sock.prototype.constructor = Sock;

// ------------------------------------------------------------------------------------------------
// METHODS
// ------------------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------------------

Sock.prototype.close = function() {
	var self = this;
	self.status('(WebSocket): Closing...');
	self._ws.close();
}

// ------------------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------------------

Sock.prototype.status = function(prefix, msg) {
	var self = this;
	console.log(prefix);

	if (msg && msg !== '')
		console.log('      MSG:', msg);

	var html = $('#status').html();
	html = (html == '&nbsp;') ? "" : html ;

	if (prefix && prefix !== '')
		html += "<br />" + prefix;

	if (msg && msg !== '')
		html += "<br /> ---> " + msg;

	$('#status').html(html);
}

// ------------------------------------------------------------------------------------------------
// API
// ------------------------------------------------------------------------------------------------

Sock.prototype.register = function(name) {
	var self = this;
	self.status('(WebSocket): Sending REGISTER request...');

	self.send({
		  msg: name,
	 endpoint: '/user/register',
		token: store.getToken(),
		error: null
	});
}

Sock.prototype.registerReceived = function(msg, pkg) {
	var self = this;
	self.status('(WebSocket): Sending REGISTER request...', pkg);
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.greet = function(name) {
	var self = this;
	self.status('(WebSocket): Sending GREETing...');

	self.send({
		  msg: 'hello',
		 name: name,
	 endpoint: '/user/greet',
		token: store.getToken(),
		error: null
	});
}

Sock.prototype.greetReceived = function(msg, pkg) {
	var self = this;
	self.status('(WebSocket): Received GREET reply from Server...', pkg);

	store.setToken(msg.token);
	$('#token').val( msg.token );
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.ping = function() {
	var self = this;
	self.status('(WebSocket): Sending PING...');

	self.send({
		  msg: 'ping',
	 endpoint: '/user/ping',
		token: store.getToken(),
		error: null
	});
}

Sock.prototype.pingReceived = function(msg, pkg) {
	var self = this;
	self.status('(WebSocket): Received PING from Server...', pkg);
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.unknownReceived = function(msg, pkg) {
	self.status('(WebSocket): UNKNOWN message from Server... ', pkg);
};

// ------------------------------------------------------------------------------------------------
// ROUTING
// ------------------------------------------------------------------------------------------------

Sock.prototype.route = function(msg, pkg) {
	var self = this;
	
	if (!msg || !msg.endpoint) {
		self.unknownReceived(msg, pkg);
		return;
	}

	switch(msg.endpoint) {
		case '/user/register':
			self.registerReceived(msg, pkg);
			break;
		case '/user/greet':
			self.greetReceived(msg, pkg);
			break;
		case '/user/ping':
			self.pingReceived(msg, pkg);
			break;
		default:
			self.unknownReceived(msg, pkg);
	}

},//route

// ------------------------------------------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------------------------------------------

Sock.prototype.onOpen = function() { // WebSocket: connected.
	var self = this;
	self.status('(WebSocket): Connection opened...');

	self._isConnected = true;

	self.greet( $('#name').val() );
};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onMessage = function (MsgEvt) { // WebSocket: message received.
	var self = this;

	var pkg = MsgEvt.data;
	var msg = util.unpack(pkg);

	if (msg.error) {
		self.status('(WebSocket): Message received... however there was an ERROR in unpacking the message.', msg);
		return;
	}

	self.route(msg, pkg);
};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onClose = function() { // WebSocket: closed.
	var self = this;
	self.status('(WebSocket): Connection closed...');

};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onError = function(err) { // WebSocket: error occured.
	var self = this;
	self.status('(WebSocket): Connection error...');
	console.log('WebSocket ERROR: ' + err.message);
}

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------