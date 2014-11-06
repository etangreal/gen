
// ------------------------------------------------------------------------------------------------
// UTIL
// ------------------------------------------------------------------------------------------------

QUnit.test( "Util test: pack/unpack", function( assert ) {
	
	var util = window.exports.Util;
	var msg = {test: "test"};

	var pkg = util.pack(msg);
	var test = util.unpack(pkg);

	assert.ok( test.test == msg.test, "Passed!" );
});

// ------------------------------------------------------------------------------------------------
// STORAGE
// ------------------------------------------------------------------------------------------------

QUnit.test( "Storage test: isStorage", function( assert ) {

	var store = window.exports.Storage;
	var token = '1234';

	assert.ok( true == store.isStorage(), "store.isStorage() Passed!" );

	store.setToken(null);
	// assert.ok( true == store.isToken(null), "store.setToken(null) && store.isToken(null) Passed!" );

	store.setToken(token);
	assert.ok( true == store.isToken(token), "store.isToken(token) && store.isToken(token) Passed!" );
	assert.ok( false == store.isToken(null), "store.isToken(token) && store.isToken(null) Failed!" );

});

// ------------------------------------------------------------------------------------------------
// WEBSOCKETS
// ------------------------------------------------------------------------------------------------

QUnit.test( "WebSockets is supported by Browser", function( assert ) {
  assert.ok( true == ('WebSocket' in window), "Passed!" );
});

// ------------------------------------------------------------------------------------------------

QUnit.asyncTest( "asynchronous test: Open a WebSocket Connection", function( assert ) {
	expect( 1 );

	var host = 'ws://' + location.host + '/';
	var ws = new WebSocket(host);

	ws.onopen = function() {
		assert.ok( true, "WebSocket Connected" );
		QUnit.start();
	};

});

// ------------------------------------------------------------------------------------------------

QUnit.asyncTest( "Asynchronous test: WebSocket HELLO Message Received", function( assert ) {
	expect( 1 );

	var util = window.exports.Util;
	var host = 'ws://' + location.host + '/';
	var ws = new WebSocket(host);

	ws.onmessage = function(MsgEvt) {
		var pkg = MsgEvt.data;
		var msg = util.unpack(MsgEvt.data);

		assert.ok( msg.msg == "HELLO" , "Greeting 'HELLO' Received!" );
		QUnit.start();
	};
});

// ------------------------------------------------------------------------------------------------

QUnit.asyncTest( "Asynchronous test: WebSocket PING-PONG Message Received", function( assert ) {
	expect( 2 );

	var util = window.exports.Util;
	var host = 'ws://' + location.host + '/';
	var ws = new WebSocket(host);

	var id = null;

	var pkg = util.pack({
		  msg: 'PING',
		 type: 'INIT',
		token: '',
		error: null
	});

	ws.onmessage = function(MsgEvt) {
		var pkg = MsgEvt.data;
		var msg = util.unpack(MsgEvt.data);

		if (msg.msg == 'HELLO') {
			assert.ok( true , "Greeting 'HELLO' Received!" );
			ws.send(pkg);
		}

		if (msg.msg == 'PONG') {
			assert.ok( true , "PONG message received!" );
			QUnit.start();
		}
	};

});

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
