

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
	var supported = ('WebSocket' in window) ? 'Is supported by your Browser!' : 'Is NOT supported by your Browser!';
	$('#supported').text(supported);

	//Web Sockets
	$('#wsHost').val('ws://' + location.host + '/');

	$('#wsConnect').on('click', function() { 
		sock.connect( $('#wsHost').val() ); 
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
