
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// CONTEXT
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

var context = (function(context) {

	// --------------------------------------------------------------------------------------------
	// CHECKS
	// --------------------------------------------------------------------------------------------

	if (!context.app) 		throw('rest.js (client) | app undefined.');
	if (!context.exports) 	throw('rest.js (client) | app undefined.');

	// --------------------------------------------------------------------------------------------
	// APP
	// --------------------------------------------------------------------------------------------

	var app 	 	= context.app 	|| {};
		app.util 	= app.util 		|| exports && new exports.Util();
		app.store 	= app.store 	|| exports && new exports.Store();

	// --------------------------------------------------------------------------------------------
	// UI
	// --------------------------------------------------------------------------------------------

	var ui = context.ui || {

		/**
		 * A jQuery object of HTML element id='status'
		 *
		 * @method $status
		 * @return {Object} A jQuery object for #status
		 *
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
		 *
		 */

		$token: function() {
			try {
				return $('#token');
			} catch(e) {
				throw('Rest.config: Could not find #token. ' + e.message);
			}
		},

		/**
		 * A jQuery object of HTML element with id='name'
		 *
		 * @method $name
		 * @return {Object} A jQuery object for #name
		 */

		$name: function() {
			try {
				return $('#name');
			} catch(e) {
				throw('Rest.config: Could not find #name. ' + e.message);
			}
		},

		/**
		 * Displays the status in the console and on the page using the element with id='status'.
		 *
		 * @method status
		 *
		 * @param {String} prefix The message prefix which will only be printed if it contains text.
		 * @param {String} msg The message (which will only be printed if it contains text)
		 *
		 * @return
		 */

		status: function(prefix, msg) {

			var $status =  ui.$status(),
				 html 	= $status.html();
				 prefix	=  prefix || '';
				 msg 	=  msg || '';

			console.log('STATUS:', prefix, msg);

			html = (html == '&nbsp;') ? '' : html + '<br /> ' ;
			html += prefix + ' ' + msg;

			$status.html(html);

		},//STATUS

	}//UI

	// --------------------------------------------------------------------------------------------
	// CONFIG
	// --------------------------------------------------------------------------------------------

	var config = context.config || {

		/**
		 * Ajax datatype to be used
		 *
		 * @property dataType
		 * @type String
		 *
		 */

		dataType: 'json',

		/**
		 * The endpoint for the user/greet
		 *
		 * @property greetEndpoint
		 * @type String
		 *
		 */

		greetEndpoint: '/user/greet',

		/**
		 * The url for the user/greet endpoint
		 *
		 * @property greetUrl
		 * @type String
		 *
		 */

		greetUrl: 'http://localhost:8080/user/greet',

		/**
		 * The endpoint for the user/handshake
		 *
		 * @property handshakeUrl
		 * @type String
		 *
		 */

		handshakeUrl: 'http://localhost:8080/user/handshake',

		/**
		 * The url for the user/handshake endpoint
		 *
		 * @property handshakeUrl
		 * @type String
		 *
		 */

		handshakeEndpoint: '/user/handshake'

	};//CONFIG

	// --------------------------------------------------------------------------------------------
	// EXPORT (CONTEXT)
	// --------------------------------------------------------------------------------------------

	return {
		  $: context.$,
		app: app,
	exports: context.exports || {},
	 config: config,
		 ui: ui
	}

})(context || {
		  $: $,
		app: app || {},
	exports: (typeof exports !== 'undefined') ?
				exports :
				this['exports'] ?
					this['exports'] : 
					this['exports'] = {}
});

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// REST (CLIENT)
// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

var app = (function(context) {
	//"use strict";

	// --------------------------------------------------------------------------------------------
	// CHECKS
	// --------------------------------------------------------------------------------------------

	if (!context) 			throw('rest.js | Context undefined!');
	if (!context.$) 		throw('rest.js | jQuery undefined!');
	if (!context.app) 		throw('rest.js | app undefined!');
	if (!context.exports) 	throw('rest.js | exports undefined!');
	if (!context.config)	throw('rest.js | config undefined!');
	if (!context.ui)		throw('rest.js | config undefined!');

	// --------------------------------------------------------------------------------------------
	// DECLARATIONS
	// --------------------------------------------------------------------------------------------

	var $ 		= context.$;
	var app 	= context.app;
	var util 	= app.util;
	var store 	= app.store;
	var exports = context.exports;
	var config  = context.config;
	var ui 		= context.ui;

	// --------------------------------------------------------------------------------------------
	// CHECKS
	// --------------------------------------------------------------------------------------------

	if (!util) 				throw('rest.js | util undefined!');
	if (!store) 			throw('rest.js | store undefined!');

	// --------------------------------------------------------------------------------------------
	// CLASS
	// --------------------------------------------------------------------------------------------

	/**
	 * Provides API for connecting to the RESTful Web Services
	 *
	 * @class Rest
	 * @constructor
	 *
	 */

	function Rest() {

	}

	// --------------------------------------------------------------------------------------------
	// PRIVATE
	// --------------------------------------------------------------------------------------------

	var me = {

		// ----------------------------------------------------------------------------------------
		// USER
		// ----------------------------------------------------------------------------------------

		/**
		 * The 'user' object provides functions for user related RESTful API
		 *
		 * @property user
		 * @type Object
		 *
		 */

		user: {

			// ------------------------------------------------------------------------------------
			// GREET
			// ------------------------------------------------------------------------------------

			/**
			 * Sends a 'greet' message to the server via REST.
			 *	Expects a reply.
			 *
			 * @method greet
			 *
			 * @return
			 */

			greet: function() {
				var	token 	= store.getToken(),
					url 	= config.greetUrl + (token ? ('/' + token) : '');

				var data 	= {
					  msg: 'hello',
				 endpoint: config.greetEndpoint,
					token: token,
					error: null
				}

				ui.status('(RESTful): SENDING GREET...', util.pack(data));

				var post = $.post(url, data, me.user.onGreetSuccess, config.dataType)
								.done(me.user.onGreetDone)
								.fail(me.user.onGreetFail)
								.always(me.user.onGreetAlways);
			},

			/**
			 * Fires if the post was successful.
			 *
			 * @event onGreetSuccess
			 *
			 * @param data {Object} A JSON object
			 * @param status {String} A status message
			 * @param xhr {Object} A jQuery XHR object
			 *
			 */

			onGreetSuccess: function(data,status,xhr) {
				// console.log('rest.user.greet: success', data);
				ui.status('(RESTful): GREET RECIEVED from Server...', util.pack(data));
			},

			/**
			 * Fires after the 'success' event.
			 *	a.k.a 'second success' event.
			 *
			 * @event onGreetDone
			 *
			 * @param data {Object} A JSON object
			 * @param status {String} A status message
			 * @param xhr {Object} A jQuery XHR object
			 *
			 */

			onGreetDone: function(data,status,xhr) {
				// console.log('rest.user.greet: done', data);
			},

			/**
			 * Fires if the post failed.
			 *
			 * @event onGreetFail
			 *
			 * @param xhr {Object} A jQuery XHR object
			 * @param status {String} reason why the 'user.greet' post failed
			 * @param error {Objec} error object
			 *
			 */

			onGreetFail: function(xhr, status, error) {
				// console.log('rest.user.greet: error');
			},

			/**
			 * Always fires as the last event of the post, whether the post fails/suceeds.
			 *
			 * @param dataOrXhr {Object} Either the data or a jQuery XHR object
			 * @param status {String} An status message
			 * @param xhrOrError {Object} Either a jQuery XHR object or and the error thrown
			 *
			 */

			onGreetAlways: function(dataOrXhr, status, xhrOrError) {
				// console.log('rest.user.greet: finished');
			},

			// ------------------------------------------------------------------------------------
			// HANDSHAKE
			// ------------------------------------------------------------------------------------

			/**
			 * Sends a 'handshake' message to the server via RESTful post. 
			 *	Expects a handshake reply message in return.
			 *
			 * @method handshake
			 *
			 * @return
			 */

			handshake: function(name) {
				var	token 	= store.getToken(), 
					url 	= config.handshakeUrl + (token ? ("/" + token) : "");

				var data 	= {
					  msg: 'hello',
					 name: name,
				 endpoint: config.handshakeEndpoint,
					token: token,
					error: null
				}

				ui.status('(RESTful): SENDING HANDSHAKE...', util.pack(data));

				var post = $.post(url, data, me.user.onHandshakeSuccess, config.dataType)
								.done(me.user.onHandshakeDone)
								.fail(me.user.onHandshakeFail)
								.always(me.user.onHandshakeAlways);
			},

			/**
			 * Fires if the post was successful.
			 *
			 * @event onHandshakeSuccess
			 *
			 * @param data {Object} A JSON object
			 * @param status {String} A status message
			 * @param xhr {Object} A jQuery XHR object
			 *
			 */

			onHandshakeSuccess: function(data, status, xhr) {
				var $token 	= ui.$token();

				ui.status('(RESTful): HANDSHAKE RECIEVED from Server...', util.pack(data));
				store.setToken(data.token);
				$token.val(data.token);
			},

			/**
			 * Fires if the post is done.
			 *	a.k.a 'second success' event.
			 *
			 * @event onHandshakeDone
			 *
			 * @param data {Object} A JSON object
			 * @param status {String} A plain text status message
			 * @param xhr {Object} A jQuery XHR object
			 *
			 */

			onHandshakeDone: function(data, status, xhr) {
				//console.log('rest.user.handshake: second success', data);
			},

			/**
			 * Fires if the post failed.
			 *
			 * @event onHandshakeFail
			 *
			 * @param xhr {Object} A jQuery XHR object
			 * @param status {String} An error status message 
			 * @param error {Object} The error thrown
			 *
			 */

			onHandshakeFail: function(xhr, status, error) {
				// console.log( "rest.user.handshake: error");
			},

			/**
			 * Always fires as the last event of the post, whether the post fails/suceeds.
			 *
			 * @event onHandshakeAlways
			 *
			 * @param dataOrXhr {Object} Either the data or a jQuery XHR object
			 * @param status {String} An status message
			 * @param xhrOrError {Object} Either a jQuery XHR object or and the error thrown
			 *
			 */

			onHandshakeAlways: function(dataOrXhr, status, xhrOrError) {
				// console.log( "rest.user.handshake: finished" );
			},

		},//ME.USER

	};//ME (PRIVATE)

	// --------------------------------------------------------------------------------------------
	// PUBLIC (CLASS PROTOTYPE)
	// --------------------------------------------------------------------------------------------

	Rest.prototype = {

		user: {

				greet: me.user.greet,
			handshake: me.user.handshake

		}//USER

	}//REST.PROTOTYPE

	// --------------------------------------------------------------------------------------------
	// EXPORT
	// --------------------------------------------------------------------------------------------

	exports.Rest = Rest;
	app.rest = new Rest();

	return app;

})(context);

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
