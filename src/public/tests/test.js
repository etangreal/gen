
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

// var util = window.exports.Util;

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

QUnit.asyncTest( "Asynchronous test: WebSocket GREET check", function( assert ) {
	expect( 1 );

	var util = window.exports.Util;
	var host = 'ws://' + location.host + '/';
	var ws = new WebSocket(host);

	var pkg = util.pack({
		  msg: 'hello',
	 endpoint: '/user/greet',
		token: '1234',
		error: null
	});

	ws.send(pkg);

	ws.onmessage = function(MsgEvt) {
		var pkg = MsgEvt.data;
		var msg = util.unpack(MsgEvt.data);

		assert.ok( msg.endpoint == "/user/greet" , "GREET Received!" );
		QUnit.start();
	};
});

// ------------------------------------------------------------------------------------------------

// QUnit.asyncTest( "Asynchronous test: WebSocket HANDSHAKE check", function( assert ) {
// 	expect( 1 );
// 	QUnit.stop();

// 	var util = window.exports.Util;
// 	var host = 'ws://' + location.host + '/';
// 	var ws = new WebSocket(host);

// 	var pkg = util.pack({
// 		  msg: 'hello',
// 		 name: 'name',
// 	 endpoint: '/user/handshake',
// 		token: '1234',
// 		error: null
// 	});

// 	ws.send(pkg);

// 	ws.onmessage = function(MsgEvt) {
// 		QUnit.stop();
// 		var pkg = MsgEvt.data;
// 		var msg = util.unpack(MsgEvt.data);

// 		assert.ok( msg.endpoint == '/user/handshake' , "HANDSHAKE Received!" );
// 		QUnit.start();
// 	};
// });

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
