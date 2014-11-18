
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var app 		= app || {};
	app.util 	= app.util || window.exports.Util;
	app.storage = app.storage || window.exports.Storage;

// ------------------------------------------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------------------------------------------

/**
 * Event handler for the window's onload event.
 *	Used hooking-up UI to javascript code, particularly UI events
 *
 * @event onLoad
 *
 */

var onLoad = function() {

	$('#token').val( app.store.getToken() );
	$('#clearToken').on('click', function() {
		app.store.clearToken();
		$('#token').val( app.store.getToken() );
	});

	//Web Socket Support
	var supported = ('WebSocket' in window) ? 'is supported by your Browser!' : 'is NOT supported by your Browser!';
	$('#supported').text(supported);

	//Web Sockets
	var host = 'ws://' + location.host + '/';

	if (supported)
		app.sock.connect(host);

	$('#wsHost').val(host);

	$('#wsConnect').on('click', function() { 
		app.sock.connect( $('#wsHost').val() ); 
	});

	$('#wsDisconnect').on('click', function() { 
		app.sock.close(); 
	});

	$('#wsGreet').on('click', function() {
		app.sock.greet();
	});

	$('#wsHandshake').on('click', function() {
		app.sock.handshake( $('#name').val() );
	});

	//REST Web Services
	$('#httpHost').val('http://' + location.host + '/');

	$('#httpGreet').on('click', function() {
		app.rest.user.greet();
	});

	$('#httpHandshake').on('click', function() {
		app.rest.user.handshake( $('#name').val() );
	});

	//Status
	$('#clearStatus').on('click', function() {
		$('#status').html('&nbsp;');
	});

}//onLoad

// ------------------------------------------------------------------------------------------------
// INIT
// ------------------------------------------------------------------------------------------------

// Initialize the tabs
app.ui.initTabs();

window.onload = onLoad;

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
