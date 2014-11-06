
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
// REST.USER
// ------------------------------------------------------------------------------------------------

Rest.prototype.user = {

	// ------------------------------------------------------------------------------------------------

	register: function(name) {

		var url = "http://localhost:8080/user/register/" + name;
		var data = {};
		var dataType = "json";

		var success = function(data,status) {
			console.log( "rest.user.register: success" );
		}

		var done = function(data) {
			console.log( "rest.user.register: second success" );
		}

		var fail = function(jqXHR, textStatus, error) {
			console.log( "rest.user.register: error");
		}

		var always = function() {
			console.log( "rest.user.register: finished" );
		}

		var post = $.post(url,data,success,dataType).done(done).fail(fail).always(always);

	},//register

	// ------------------------------------------------------------------------------------------------
	
	greet: function(token) {

		var url = "http://localhost:8080/user/greet/" + token;
		var data = {};
		var dataType = "json";

		var success = function(data,status) {
			console.log( "rest.user.greet: success" );
		}

		var done = function(data) {
			console.log( "rest.user.greet: second success" );
		}

		var fail = function(jqXHR, textStatus, error) {
			console.log( "rest.user.greet: error");
		}

		var always = function() {
			console.log( "rest.user.greet: finished" );
		}

		var post = $.post(url,data,success,dataType).done(done).fail(fail).always(always);

	},//greet

	// ------------------------------------------------------------------------------------------------

	ping: function() {

		var url = "http://localhost:8080/user/ping";
		var data = {};
		var dataType = "json";

		var success = function(data,status) {
			console.log( "rest.user.ping: success" );
		}

		var done = function(data) {
			console.log( "rest.user.ping: second success" );
		}

		var fail = function(jqXHR, textStatus, error) {
			console.log( "rest.user.ping: error");
		}

		var always = function() {
			console.log( "rest.user.ping: finished" );
		}

		var post = $.post(url,data,success,dataType).done(done).fail(fail).always(always);

	},//ping

	// ------------------------------------------------------------------------------------------------

};//Rest.prototype.user

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
