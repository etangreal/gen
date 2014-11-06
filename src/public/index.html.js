

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

	$('#wsPing').on('click', function() {
		sock.ping();
	});

	//REST Web Services
	$('#httpHost').val('http://' + location.host + '/');

	$('#httpRegister').on('click', function() {
		rest.user.register( $('#name').val() );
	});

	$('#httpGreet').on('click', function() {
		rest.user.greet( store.getToken() );
	});

	$('#httpPing').on('click', function() {
		rest.user.ping();
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
