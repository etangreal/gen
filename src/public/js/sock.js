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
	self.status('host: ' + host);

	//open a web socket
	var ws = new WebSocket(host);

	ws.onopen = self.onOpen.bind(self);
	ws.onmessage = self.onMessage.bind(self);
	ws.onclose = self.onClose.bind(self);
	ws.onerror = self.onError.bind(self);

	self._ws = ws;
}

// ------------------------------------------------------------------------------------------------

// function log(obj) {
//     $('#status').text(JSON.stringify(obj));
// }

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

Sock.prototype.send = function(msg) {
	var self = this;
	self.status('Message sent...');

	var pkg = util.pack(msg);
	self._ws.send(pkg);

	self.status(pkg);
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.register = function(name) {
	var self = this;	

	if (!self._isConnected) {
		self.status('No connection!');
		return;
	}

	self.send({
		  msg: name,
		 type: '/user/register',
		token: store.getToken(),
		error: null
	});
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.greet = function() {
	var self = this;	

	if (!self._isConnected) {
		self.status('No connection!');
		return;
	}

	self.send({
		  msg: 'hello',
		 type: '/user/greet',
		token: store.getToken(),
		error: null
	});
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.ping = function() {
	var self = this;	

	if (!self._isConnected) {
		self.status('No connection!');
		return;
	}

	self.send({
		  msg: '',
		 type: '/user/ping',
		token: store.getToken(),
		error: null
	});
}

// ------------------------------------------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------------------------------------------

Sock.prototype.onOpen = function() { // WebSocket: connected.
	var self = this;
	self.status('Connection opened...');

	self._isConnected = true;
};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onMessage = function (MsgEvt) { // WebSocket: message received.
	var self = this;
	self.status('Message received...');

	var pkg = MsgEvt.data;
	var msg = util.unpack(pkg);
	self.status(pkg);

	if (msg.error) {
		self.status('ERROR: ' + msg.error);
		return;
	}
};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onClose = function() { // WebSocket: closed.
	var self = this;
	self.status('Connection closed...');

};

// ------------------------------------------------------------------------------------------------

Sock.prototype.onError = function(err) { // WebSocket: error occured.
	var self = this;
	self.status('Connection error...');
	self.status('ERROR: ' + err.message);

}

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------