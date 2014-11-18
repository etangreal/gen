
// ------------------------------------------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------------------------------------------

var __exports__ = __exports__ ||

	(typeof exports !== 'undefined') ? 
		exports : 
		this['exports'] ? 
			this['exports'] : 
			this['exports'] = {};

// ------------------------------------------------------------------------------------------------
// HTML5 STORAGE (Client)
// ------------------------------------------------------------------------------------------------

(function(exports) {

	/**
	 * Provides functions for storing user data (currently the token)
	 *
	 * @class Storage
	 * @constructor
	 *
	 */

	var self = exports.Storage = {

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
			var t = self.getToken();
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

	};//exports.Storage

})( __exports__ );

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
