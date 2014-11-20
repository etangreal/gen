
// ------------------------------------------------------------------------------------------------
// STORE (SERVER-SIDE: IN-MEMORY-DICTIONARY)
// ------------------------------------------------------------------------------------------------

(function(exports) {

	// --------------------------------------------------------------------------------------------
	// CLASS
	// --------------------------------------------------------------------------------------------

	/**
	 * Provides functions for storing user data (currently the token)
	 *
	 * @class Store (Server-Side)
	 * @constructor
	 *
	 */

	function Store() {

	}

	var me = Store.prototype = {

		// ----------------------------------------------------------------------------------------
		// PROPERTIES
		// ----------------------------------------------------------------------------------------

		/**
		 * A key/value data store
		 *
		 * @property store
		 *
		 */

		store: {},

		// ----------------------------------------------------------------------------------------
		// METHODS
		// ----------------------------------------------------------------------------------------

		/**
		 * Adds a token and name to the data store
		 *
		 * @method add
		 *
		 * @param {String} token 
		 *	A UUID which uniquely identifies a client
		 *
		 * @param {String} name 
		 *	The name by which the client calls itself
		 *
		 * @return
		 *
		 */

		add: function(token, name) {
			me.store[token] = name;
		},

		/**
		 * Finds the value associated with a token
		 *
		 * @method add
		 *
		 * @param {String} token A UUID which uniquely identifies a client
		 *
		 * @return {String} Returns the name associated with the token. 
		 *	Returns null if the token was not found.
		 *
		 */

		find: function(token) {
			return me.store[token];
		},

		/**
		 * Checks to see if a token exists
		 *
		 * @method exists
		 *
		 * @param {String} token A UUID which uniquely identifies a client
		 *
		 * @return {Boolean} Returns true if the token exists otherwise false.
		 *
		 */

		exists: function(token) {
			return (token in me.store);
		}

	};//Store.prototype

	// --------------------------------------------------------------------------------------------
	// EXPORTS
	// --------------------------------------------------------------------------------------------

	exports.Store = Store;

})(exports);

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
