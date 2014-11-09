
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

//var util = window.exports.Util;

// ------------------------------------------------------------------------------------------------
// UTIL
// ------------------------------------------------------------------------------------------------

QUnit.module( "client/util.js" );

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

QUnit.module( "client/storage.js" );

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

QUnit.module( "client/sock.js" );

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

	ws.onerror = function(err) {
		assert.ok(false, "websocket: error occurred... " + err.message);
		QUnit.stop();
	}

	setTimeout(function() {
		assert.ok(false, "Timeout occured, websocket connection never opened...");
		QUnit.stop();
	}, 1000);

});

// ------------------------------------------------------------------------------------------------

QUnit.asyncTest( 'Asynchronous test: WebSocket GREET check', function( assert ) {
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

	ws.onopen = function () { 
		ws.send(pkg);
	}

	ws.onerror = function(err) {
		assert.ok(false, "websocket: error occurred... " + err.message);
		QUnit.stop();
	}

	ws.onmessage = function(MsgEvt) {
		var pkg = MsgEvt.data;
		var msg = util.unpack(MsgEvt.data);

		assert.ok( msg.endpoint == "/user/greet" , "GREET received!");
		QUnit.start();
	};

	setTimeout(function() {
		assert.ok(false, "Timeout occured, reply message wasn't received...");
		QUnit.stop();
	}, 1000);

});//QUnit.asyncTest 'Asynchronous test: WebSocket GREET check'

// ------------------------------------------------------------------------------------------------

QUnit.asyncTest( 'Asynchronous test: WebSocket HANDSHAKE check', function( assert ) {
	expect( 2 );

	var util = window.exports.Util;
	var host = 'ws://' + location.host + '/';

	var ws = new WebSocket(host);

	var pkg = util.pack({
		  msg: 'hello',
		 name: 'test',
	 endpoint: '/user/handshake',
		token: '1234',
		error: null
	});

	ws.onopen = function () { 
		ws.send(pkg);
	}

	ws.onerror = function(err) {
		assert.ok(false, "websocket: error occurred... " + err.message);
		QUnit.stop();
	}

	ws.onmessage = function(MsgEvt) {
		var pkg = MsgEvt.data;
		var msg = util.unpack(MsgEvt.data);

		assert.ok( msg.endpoint == "/user/handshake" , "HANDSHAKE endpoint." );
		assert.ok( msg.error == null , "HANDSHAKE error." );
		QUnit.start();
	};

	setTimeout(function() {
		assert.ok(false, "Timeout occured, reply message wasn't received...");
		QUnit.stop();
	}, 1000);

});//QUnit.asyncTest 'Asynchronous test: WebSocket HANDSHAKE check'

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
