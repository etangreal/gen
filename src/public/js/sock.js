// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var util = window.exports.Util;
var storage = window.exports.Storage;

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
// FUNCTIONS
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

Sock.prototype.status = function(msg) {
	var self = this;
	console.log(msg);

	var html = $('#status').html();
	html = (html == '&nbsp;') ? "" : html + "<br />";

	$('#status').html(html + msg);
}

// function log(obj) {
//     $('#status').text(JSON.stringify(obj));
// }

// ------------------------------------------------------------------------------------------------

Sock.prototype.send = function(msg) {
	var self = this;
	self.status('Message sent...');

	var pkg = util.pack(msg);
	self._ws.send(pkg);

	self.status(pkg);
}

// ------------------------------------------------------------------------------------------------

Sock.prototype.ping = function() {
	var self = this;	

	if (!self._isConnected) {
		self.status('No connection!');
		return;
	}

	self.send({
		  msg: 'PING',
		 type: 'INIT',
		token: storage.getToken(),
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