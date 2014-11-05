

// ------------------------------------------------------------------------------------------------
// DECLARATIONS
// ------------------------------------------------------------------------------------------------

var sock = new Sock();
var rest = {};

// ------------------------------------------------------------------------------------------------
// EVENTS
// ------------------------------------------------------------------------------------------------

var onLoad = function() {

	if ('WebSocket' in window)
		$('#supported').text('Is supported by your Browser!');
	else
		$('#supported').text('Is NOT supported by your Browser!');

	$('#wsHost').val('ws://' + location.host + '/');
	$('#wsConnect').on('click', onWsConnectClick);
	$('#wsPing').on('click', onWsPingClick);

	$('#httpHost').val('http://' + location.host + '/');

	$('#clearStatus').on('click', onClearStatusClick);

}//onLoad

// ------------------------------------------------------------------------------------------------
// WebSockets
// ------------------------------------------------------------------------------------------------

var onWsConnectClick = function() {
	sock.connect( $('#wsHost').val() );
}

// ------------------------------------------------------------------------------------------------

var onWsPingClick = function() {
	sock.ping();
}

// ------------------------------------------------------------------------------------------------
// Http
// ------------------------------------------------------------------------------------------------

var onHttpConnectClick = function() {
	//sock.connect( $('#wsHost').val() );
}

// ------------------------------------------------------------------------------------------------

var onHttpPingClick = function() {
	//sock.ping();
}

// ------------------------------------------------------------------------------------------------
// Status
// ------------------------------------------------------------------------------------------------

var onClearStatusClick = function() {
	$('#status').html('&nbsp;');
}

// ------------------------------------------------------------------------------------------------
// INIT
// ------------------------------------------------------------------------------------------------

function initTabs() {

 	$('ul.tabs').each(function(){
	    // For each set of tabs, we want to keep track of
	    // which tab is active and it's associated content
	    var $active, $content, $links = $(this).find('a');

	    // If the location.hash matches one of the links, use that as the active tab.
	    // If no match is found, use the first link as the initial active tab.
	    $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
	    $active.addClass('active');

	    $content = $($active[0].hash);

	    // Hide the remaining content
	    $links.not($active).each(function () {
	      $(this.hash).hide();
	    });

	    // Bind the click event handler
	    $(this).on('click', 'a', function(e){
	      // Make the old tab inactive.
	      $active.removeClass('active');
	      $content.hide();

	      // Update the variables with the new link and content
	      $active = $(this);
	      $content = $(this.hash);

	      // Make the tab active.
	      $active.addClass('active');
	      $content.show();

	      // Prevent the anchor's default click action
	      e.preventDefault();
	    });
	});

};//initTabs

// ------------------------------------------------------------------------------------------------

initTabs();

window.onload = onLoad;

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------