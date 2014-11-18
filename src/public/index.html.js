
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var app 		= app || {};
	app.util 	= app.util || window.exports.Util;
	app.storage = app.storage || window.exports.Storage;

var sock = new Sock();

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

	$('#token').val( store.getToken() );
	$('#clearToken').on('click', function() {
		store.clearToken();
		$('#token').val( store.getToken() );
	});

	//Web Socket Support
	var supported = ('WebSocket' in window) ? 'is supported by your Browser!' : 'is NOT supported by your Browser!';
	$('#supported').text(supported);

	//Web Sockets
	var host = 'ws://' + location.host + '/';

	if (supported)
		sock.connect(host);

	$('#wsHost').val(host);

	$('#wsConnect').on('click', function() { 
		sock.connect( $('#wsHost').val() ); 
	});

	$('#wsDisconnect').on('click', function() { 
		sock.close(); 
	});

	$('#wsGreet').on('click', function() {
		sock.greet();
	});

	$('#wsHandshake').on('click', function() {
		sock.handshake( $('#name').val() );
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
ui.initTabs();

window.onload = onLoad;

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
