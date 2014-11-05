
// matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node
// caolanmcmahon.com/posts/writing_for_node_and_the_browser

// ------------------------------------------------------------------------------------------------
// UTIL
// ------------------------------------------------------------------------------------------------

(function(exports) {
	exports = exports || {};

	exports.Util = {

		// ----------------------------------------------------------------------------------------

		unpack: function(pkg) {
			try {
				return JSON.parse(pkg);

			} catch (e) {
				return {error:'Invalid Json object.'};
			}
		},

		// ----------------------------------------------------------------------------------------

		pack: function(msg) {
			return JSON.stringify(msg);
		},

		// ----------------------------------------------------------------------------------------

	};//exports.Util

})( typeof exports !== 'undefined' ? 
		exports : 
		this['exports'] ? 
			this['exports'] : 
			this['exports'] = {} );

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------