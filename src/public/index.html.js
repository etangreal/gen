
// ------------------------------------------------------------------------------------------------
// DECLARATIONS
// ------------------------------------------------------------------------------------------------

var util = window.exports.Util;
var store = window.exports.Storage;

var sock = new Sock();
var rest = new Rest();

// ------------------------------------------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------------------------------------------

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
		rest.user.greet();
	});

	$('#httpHandshake').on('click', function() {
		rest.user.handshake( $('#name').val() );
	});

	//Status
	$('#clearStatus').on('click', function() {
		$('#status').html('&nbsp;');
	});

}//onLoad

// ------------------------------------------------------------------------------------------------
// INIT
// ------------------------------------------------------------------------------------------------

initTabs();

window.onload = onLoad;

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
