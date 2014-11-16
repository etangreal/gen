
// ------------------------------------------------------------------------------------------------
// STORAGE (Server)
// ------------------------------------------------------------------------------------------------

var self = module.exports = {

	/**
	 * A key/value data store
	 *
	 * @property store
	 *
	 */

	store: {}, 

	/**
	 * Adds a token and name to the data store
	 *
	 * @method add
	 *
	 * @param {String} token A UUID which uniquely identifies a client
	 * @param {String} name The name by which the client calls itself
	 *
	 * @return
	 */

	add: function(token, name) {
		self.store[token] = name;
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
	 */

	find: function(token) {
		return self.store[token];
	},

	/**
	 * Checks to see if a token exists
	 *
	 * @method exists
	 *
	 * @param {String} token A UUID which uniquely identifies a client
	 *
	 * @return {Boolean} Returns true if the token exists otherwise false.
	 */

	exists: function(token) {
		return (token in self.store);
	}

};//module.exports

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------
