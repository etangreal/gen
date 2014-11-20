
// ------------------------------------------------------------------------------------------------
// STORE (CLIENT-SIDE: HTML5 STORAGE)
// ------------------------------------------------------------------------------------------------

var app = (function(app, exports) {

	app = app || {};

	// --------------------------------------------------------------------------------------------
	// CLASS
	// --------------------------------------------------------------------------------------------

	/**
	 * Provides functions for storing user data (currently the token)
	 *
	 * @class Store
	 * @constructor
	 *
	 */

	function Store() {

	}

	var me = Store.prototype = {

		/**
		 * Checks if HTML5 storage is available
		 *
		 * @method isStorage
		 *
		 * @return
		 */

		isStorage: function() {
			return (typeof (Storage) !== 'undefined');
		},

		/**
		 * Checks if a user token is present in storage
		 *
		 * @method isToken
		 *
		 * @return
		 */

		isToken: function(token) {
			var t = me.getToken();
			return (t && t == token);
		},

		/**
		 * Gets the user Token from local storage
		 *
		 * @method getToken
		 *
		 * @return
		 */

		getToken: function() {
			return localStorage.getItem('token');
		},

		/**
		 * Saves a token for the current browser client
		 *
		 * @method setToken
		 * @param {String} token The token to be saved to local storage
		 *
		 * @return
		 */

		setToken: function(token) {
			localStorage.setItem('token', token);
		},

		/**
		 * Clears the currently saved token
		 *
		 * @method clearToken
		 * @param {String} token The token to be saved to local storage
		 *
		 * @return
		 */

		clearToken: function() {
			localStorage.setItem('token', null);
		}

	};//Store.prototype

	// --------------------------------------------------------------------------------------------
	// EXPORTS
	// --------------------------------------------------------------------------------------------

	exports.Store = Store;
	app.store = new Store();

	return app;

})(app, (typeof exports !== 'undefined') ? 
			exports : 
			this['exports'] ? 
				this['exports'] : 
				this['exports'] = {} );

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
