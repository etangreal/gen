
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var util = window.exports.Util;
var storage = window.exports.Storage;

// ------------------------------------------------------------------------------------------------
// CONSTRUCTOR
// ------------------------------------------------------------------------------------------------

function Rest() {
	var self = this;
}

Rest.prototype.constructor = Rest;

// ------------------------------------------------------------------------------------------------
// METHODS
// ------------------------------------------------------------------------------------------------

Rest.prototype.status = function(prefix, msg) {
	console.log(prefix);
	if (msg && msg !== '')
		console.log(' ---> ', msg);

	var html = $('#status').html();
	html = (html == '&nbsp;') ? "" : html ;

	if (prefix && prefix !== '')
		html += "<br />" + prefix;

	if (msg && msg !== '')
		html += "<br /> ---> " + msg;

	$('#status').html(html);
}

// ------------------------------------------------------------------------------------------------
// REST.USER API
// ------------------------------------------------------------------------------------------------

Rest.prototype.user = {

	// --------------------------------------------------------------------------------------------
	// API
	// --------------------------------------------------------------------------------------------
	
	greet: function() {

		var token = store.getToken();
		var tac = token ? ("/" + token) : "";

		var url = "http://localhost:8080/user/greet" + tac;

		var data = {
			  msg: 'hello',
		 endpoint: '/user/greet',
			token: token,
			error: null
		}

		var dataType = "json";

		var success = function(data,status) {
			// console.log('rest.user.greet: success', data);
			Rest.prototype.status('(RESTful): GREET RECIEVED from Server...', util.pack(data));
		}

		var done = function(data) {
			//console.log('rest.user.greet: second success', data);
		}

		var fail = function(jqXHR, textStatus, error) {
			//console.log('rest.user.greet: error');
		}

		var always = function() {
			//console.log('rest.user.greet: finished');
		}

		Rest.prototype.status('(RESTful): SENDING GREET...', util.pack(data));
		var post = $.post(url,data,success,dataType).done(done).fail(fail).always(always);

	},//greet

	// --------------------------------------------------------------------------------------------

	handshake: function(name) {
		var self = this;

		var token = store.getToken();
		var tac = token ? ("/" + token) : "";

		var url = "http://localhost:8080/user/handshake" + tac;

		var data = {
			  msg: 'hello',
			 name: name,
		 endpoint: '/user/handshake',
			token: store.getToken(),
			error: null
		}

		var dataType = "json";

		var success = function(data,status) {
			Rest.prototype.status('(RESTful): HANDSHAKE RECIEVED from Server...', util.pack(data));
			store.setToken(data.token);
			$('#token').val(data.token);
		}

		var done = function(data) {
			//console.log('rest.user.ping: second success', data);
		}

		var fail = function(jqXHR, textStatus, error) {
			// console.log( "rest.user.ping: error");
		}

		var always = function() {
			// console.log( "rest.user.ping: finished" );
		}

		Rest.prototype.status('(RESTful): SENDING HANDSHAKE...', util.pack(data));
		var post = $.post(url,data,success,dataType).done(done).fail(fail).always(always);

	},//ping

	// --------------------------------------------------------------------------------------------

};//Rest.prototype.user

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
