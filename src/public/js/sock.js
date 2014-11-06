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
	self.status('WebSocket: Connecting...');

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
	self.status('WebSocket: Closing...');
	self._ws.close();
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.send = function(msg) {
	var self = this;
	self.status('WebSocket: Message sent...');

	var pkg = util.pack(msg);
	self._ws.send(pkg);

	self.status('Websocket: ' + pkg);
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.status = function(msg) {
	var self = this;
	console.log(msg);

	var html = $('#status').html();
	html = (html == '&nbsp;') ? "" : html + "<br />";

	$('#status').html(html + msg);
}

// ------------------------------------------------------------------------------------------------
// API
// ------------------------------------------------------------------------------------------------

Sock.prototype.register = function(name) {
	var self = this;	

	if (!self._isConnected) {
		self.status('WebSocket: No connection!');
		return;
	}

	self.status('WebSocket: Sending register...');

	self.send({
		  msg: name,
	 endpoint: '/user/register',
		token: store.getToken(),
		error: null
	});
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.greet = function() {
	var self = this;	

	if (!self._isConnected) {
		self.status('WebSocket: No connection!');
		return;
	}

	self.status('WebSocket: Sending greet...');

	self.send({
		  msg: 'hello',
	 endpoint: '/user/greet',
		token: store.getToken(),
		error: null
	});
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.ping = function() {
	var self = this;	

	if (!self._isConnected) {
		self.status('WebSocket: No connection!');
		return;
	}

	self.status('WebSocket: Sending ping...');

	self.send({
		  msg: '',
	 endpoint: '/user/ping',
		token: store.getToken(),
		error: null
	});
}

// ------------------------------------------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------------------------------------------

Sock.prototype.onOpen = function() { // WebSocket: connected.
	var self = this;
	self.status('WebSocket: Connection opened...');

	self._isConnected = true;
};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onMessage = function (MsgEvt) { // WebSocket: message received.
	var self = this;
	self.status('WebSocket: Message received...');

	var pkg = MsgEvt.data;
	var msg = util.unpack(pkg);
	self.status('WebSocket: ' + pkg);

	if (msg.error) {
		self.status('WebSocket: ERROR: ' + msg.error);
		return;
	}
};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onClose = function() { // WebSocket: closed.
	var self = this;
	self.status('WebSocket: Connection closed...');

};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onError = function(err) { // WebSocket: error occured.
	var self = this;
	self.status('WebSocket: Connection error...');
	console.log('WebSocket ERROR: ' + err.message);
}

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------