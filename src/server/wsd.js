
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
	// SERVICE
	// --------------------------------------------------------------------------------------------

	poll: function(ws) {
		console.log('Started Polling...');

		var id = setInterval( function() {

			var pkg = util.pack({
				 msg: Date.now(),
				type: 'POLL',
				token: null,
				error: null
			});

			ws.send(pkg);
			console.log('POLL: ', util.display(pkg));

		}, 5000);

		return id;
	},

	// --------------------------------------------------------------------------------------------
	// EVENTS
	// --------------------------------------------------------------------------------------------

	onConnect: function(ws) { //ws: WebSocket
		console.log('Client connected...');
		var wss = this; //Web SocketServer

		var id = null; //= self.poll(ws);

		ws.onmessage = self.onMessage.bind({ws:ws});
		ws.onclose 	 = self.onClose.bind({id:id});
		ws.onerror 	 = self.onError.bind({id:id});

		var pkg = util.pack({
			  msg: 'HELLO',
			 type: 'INIT',
			token: uuid.v1(),
			error: null
		});

		ws.send(pkg);
		console.log('GREET: ' + pkg);
	},

	// --------------------------------------------------------------------------------------------

	onMessage: function(MsgEvt) { // Listen for msgs from the client
		console.log('Message recieved...');
		var ws = this.ws; //WebSocket

		var pkg = MsgEvt.data
		var msg = util.unpack(pkg);

		if (!msg.error) {
			if (msg.type == 'INIT') {
				console.log('INIT: ' + pkg);

				var pkg = util.pack({
					  msg: 'PONG',
					 type: 'INIT',
					token: null,
					error: null
				});

				ws.send(pkg);
				console.log('REPLIED: ' + pkg);

			} else {
				console.log('UNKNOWN: ' + pkg);
			}

		} else {
			console.log('ERROR: ' + msg.error);
		}

	    //wss.broadcast(msg); // And broadcast them to everyone
	},

	// --------------------------------------------------------------------------------------------

	onError: function(err) {
		console.log('Connection Error...');
		console.log('ERROR: ' + err.message);

		//ToDo: stop polling...
	},

	// --------------------------------------------------------------------------------------------

	onClose: function() {
		console.log('Connection Closed...');

		// console.log('Stopped Polling...');
		// clearInterval(this.id);
	}

};//module.exports

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
