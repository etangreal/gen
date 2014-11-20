
var app = (function(app, $, exports) {

	app 		= app || {};
	app.util 	= app.util || new exports.Util();
	app.store 	= app.store || new exports.Storage();

	// --------------------------------------------------------------------------------------------
	// CHECK
	// --------------------------------------------------------------------------------------------

	if (!app.util)
		throw('rest.js: object app.util not found.');

	if(!app.store)
		throw('rest.js: object app.store not found.');

	// --------------------------------------------------------------------------------------------
	// CLASS
	// --------------------------------------------------------------------------------------------

	/**
	 * Provides API for connecting to the RESTful Web Services
	 *
	 * @class Rest
	 * @constructor
	 */

	function Rest(util, store) {
		var self = this;

		// ToDo: See if this actually works...
		// self.util = util || self.util;
		// self.store = store || self.store;
	}

	// Rest.prototype.constructor = Rest;
	var me = Rest.prototype = {

		// ----------------------------------------------------------------------------------------
		// DEPENDANCIES
		// ----------------------------------------------------------------------------------------

		/**
		 * Utilities (imported module)
		 * 
		 * @property util
		 * @type Object
		 */

		util: app.util,

		/**
		 * Storage (imported module)
		 * 
		 * @property store
		 * @type Object
		 */

		store: app.store,

		// ----------------------------------------------------------------------------------------
		// CONFIG
		// ----------------------------------------------------------------------------------------

		/**
		 * Configuration data for Rest
		 * 
		 * @property config
		 * @type Object
		 */

		config: {

			/**
			 * A jQuery object of HTML element id='status'
			 *
			 * @method $status
			 * @return {Object} A jQuery object for #status
			 */

			$status: function() {
				try {
					return $('#status');
				} catch(e) {
					throw('Rest.config: Could not find #status. ' + e.message);
				}
			},

			/**
			 * A jQuery object of HTML element with id='token'
			 *
			 * @method $token
			 * @return {Object} A jQuery object for #token
			 */

			$token: function() {
				try {
					return $('#token');
				} catch(e) {
					throw('Rest.config: Could not find #token. ' + e.message);
				}
			},

			/**
			 * Ajax datatype to be used
			 *
			 * @property dataType
			 * @type String
			 */

			dataType: 'json',

			/**
			 * The endpoint for the user/greet
			 *
			 * @property greetEndpoint
			 * @type String
			 */

			greetEndpoint: '/user/greet',

			/**
			 * The url for the user/greet endpoint
			 *
			 * @property greetUrl
			 * @type String
			 */

			greetUrl: 'http://localhost:8080/user/greet',

			/**
			 * The endpoint for the user/handshake
			 *
			 * @property handshakeUrl
			 * @type String
			 */

			handshakeUrl: 'http://localhost:8080/user/handshake',

			/**
			 * The url for the user/handshake endpoint
			 *
			 * @property handshakeUrl
			 * @type String
			 */

			handshakeEndpoint: '/user/handshake'

		},//config

		// ----------------------------------------------------------------------------------------
		// METHODS
		// ----------------------------------------------------------------------------------------

		/**
		 * Displays the status in the console and on the page using the element with id='status'
		 *
		 * @method status
		 *
		 * @param {String} prefix The message prefix which will only be printed if it contains text.
		 * @param {String} msg The message (which will only be printed if it contains text)
		 *
		 * @return
		 */

		status: function(prefix, msg) {
			if (!prefix) prefix = '';
			if (!msg) msg = '';

			console.log('STATUS:', prefix, msg);

			var $status   = me.config.$status(),
				 html 	  = $status.html();

			html = (html == '&nbsp;') ? '' : html + '<br /> ' ;
			html += prefix + ' ' + msg;

			$status.html(html);
		},//status

		// ----------------------------------------------------------------------------------------
		// API
		// ----------------------------------------------------------------------------------------

		/**
		 * The user object provides functions for using the USER RESTful API 
		 *
		 * @property user
		 * @type Object
		 *
		 */

		user: {

			/**
			 * Sends a 'greet' message to the server via REST. 
			 *	Expects a greet reply message in return.
			 *
			 * @method greet
			 *
			 * @return
			 */

			greet: function() {
				var	token 	= me.store.getToken(),
					url 	= me.config.greetUrl + (token ? ('/' + token) : '');

				var data 	= {
					  msg: 'hello',
				 endpoint: me.config.greetEndpoint,
					token: token,
					error: null
				}

				var success = function(data,status) {
					// console.log('rest.user.greet: success', data);
					me.status('(RESTful): GREET RECIEVED from Server...', me.util.pack(data));
				}

				var done = function(data) {
					// console.log('rest.user.greet: done', data);
				}

				var fail = function(jqXHR, textStatus, error) {
					// console.log('rest.user.greet: error');
				}

				var always = function() {
					// console.log('rest.user.greet: finished');
				}

				me.status('(RESTful): SENDING GREET...', me.util.pack(data));

				var post = $.post(url, data, success, me.config.dataType)
								.done(done)
								.fail(fail)
								.always(always);

			},//greet

			/**
			 * Sends a 'handshake' message to the server via REST. 
			 *	Expects a handshake reply message in return.
			 *
			 * @method handshake
			 *
			 * @return
			 */

			handshake: function(name) {
				var	token 	= me.store.getToken(),
				   $token 	= me.config.$token(), 
					url 	= me.config.handshakeUrl + (token ? ("/" + token) : "");

				var data 	= {
					  msg: 'hello',
					 name: name,
				 endpoint: me.config.handshakeEndpoint,
					token: token,
					error: null
				}

				var success = function(data,status) {
					me.status('(RESTful): HANDSHAKE RECIEVED from Server...', me.util.pack(data));
					me.store.setToken(data.token);
					$token.val(data.token);
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

				me.status('(RESTful): SENDING HANDSHAKE...', me.util.pack(data));

				var post = $.post(url, data, success, me.config.dataType)
								.done(done)
								.fail(fail)
								.always(always);

			},//ping

		},//user

	};//Rest.prototype

	// --------------------------------------------------------------------------------------------
	// EXPORT
	// --------------------------------------------------------------------------------------------

	exports.Rest = Rest;
	app.rest = new Rest();

	return app;

})(app, $, (typeof exports !== 'undefined') ? 
				exports : 
				this['exports'] ?
					this['exports'] : 
					this['exports'] = {} );

/* ------------------------------------------------------------------------------------------------
## (DOCUMENTATION)
## ------------------------------------------------------------------------------------------------

	Inheritance
		developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_Revisited

	Module-Pattern
		adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

	BOOK
		JavaScript: The good Parts

## ------------------------------------------------------------------------------------------------
## END
## --------------------------------------------------------------------------------------------- */
