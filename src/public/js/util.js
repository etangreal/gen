
// ------------------------------------------------------------------------------------------------
// DECLARATIONS
// ------------------------------------------------------------------------------------------------

var __exports__ = __exports__ || 

	(typeof exports !== 'undefined') ? 
		exports : 
		this['exports'] ? 
			this['exports'] : 
			this['exports'] = {};

// ------------------------------------------------------------------------------------------------
// UTIL
// ------------------------------------------------------------------------------------------------

(function(exports) {

	/**
	 * Provides utility functions
	 *
	 * @class Util
	 * @constructor
	 */

	exports.Util = {

		/**
		 * A function that will create namespaces for you. e.g. "hello.world" { hello: { world: {} }
		 *
		 * @method namespace
		 *
		 * @param {String} namespaceString The "." (dot) separated string that is converted into a namespace
		 *
		 * @return {Object}
		 */

		namespace: function (namespaceString) {
			var parts = namespaceString.split('.'),
			parent = window,
			currentPart = '';

			for(var i = 0, length = parts.length; i < length; i++) {
				currentPart = parts[i];
				parent[currentPart] = parent[currentPart] || {};
				parent = parent[currentPart];
			}

			return parent;
		},

		/**
		 * Unpacks a stringified JSON object. If an error occurs it will return error object
		 *
		 * @method unpack
		 *
		 * @param {String} pkg stringified JSON object that will be parsed.
		 *
		 * @return {Object}
		 */

		unpack: function(pkg) {
			try {
				return JSON.parse(pkg);

			} catch (e) {
				return {error:'Invalid JSON object.'};
			}
		},

		/**
		 * Stringifies a JSON object
		 *
		 * @method pack
		 *
		 * @param {String} pkg JSON object that will be stringified.
		 *
		 */

		pack: function(msg) {
			return JSON.stringify(msg);
		},

	};//exports.Util

})( __exports__ );

/* ------------------------------------------------------------------------------------------------
## (DOCUMENTATION)
## ------------------------------------------------------------------------------------------------

	JavaScript Modules for both node.js and the browser
		matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node
		caolanmcmahon.com/posts/writing_for_node_and_the_browser

	Module Pattern
		addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript
		adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

	Namespaces
		elegantcode.com/2011/01/26/basic-javascript-part-8-namespaces

## ------------------------------------------------------------------------------------------------
## END
## --------------------------------------------------------------------------------------------- */
