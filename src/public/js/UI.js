// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------

var app = app || {};

// ------------------------------------------------------------------------------------------------
// CLOSURE
// ------------------------------------------------------------------------------------------------

(function(app, $) {

	// --------------------------------------------------------------------------------------------
	// CHECK PREREQUISITES
	// --------------------------------------------------------------------------------------------

	if (!app)
		throw('rest: object app not found.');

	// --------------------------------------------------------------------------------------------
	// UI
	// --------------------------------------------------------------------------------------------

	/**
	 * UI utility functions for initializing/manipulating the user interface
	 *
	 * @class ui
	 */

	function UI() {
		// var self = this;
	}

	UI.prototype = {

		// ----------------------------------------------------------------------------------------
		// CONFIG
		// ----------------------------------------------------------------------------------------

		/**
		 * Configuration data for Rest
		 * 
		 * @property config
		 # @type Object
		 */

		config: {

		},

		/**
		 * Initializes with the UI. Sets up tabs for any class that has class='.tabs'
		 *
		 * @method initTabs
		 * @return
		 */

		initTabs: function() {
			$('ul.tabs').each(function() { 
				// For each set of tabs, we want to keep track of
				// which tab is active and it's associated content
				var $active, $content, $links = $(this).find('a');

				// If the location.hash matches one of the links, use that as the active tab.
				// If no match is found, use the first link as the initial active tab.
				$active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
				$active.addClass('active');

				$content = $($active[0].hash);

				// Hide the remaining content
				$links.not($active).each(function () {
					$(this.hash).hide();
				});

				// Bind the click event handler
				$(this).on('click', 'a', function(e) {
					// Make the old tab inactive.
					$active.removeClass('active');
					$content.hide();

					// Update the variables with the new link and content
					$active = $(this);
					$content = $(this.hash);

					// Make the tab active.
					$active.addClass('active');
					$content.show();

					// Prevent the anchor's default click action
					e.preventDefault();
				});//.on('click'
			});//$('ul.tabs').each

		},//initTabs

	};//UI.Prototype

	// --------------------------------------------------------------------------------------------
	// EXPORT REST
	// --------------------------------------------------------------------------------------------

	app.ui = app.ui || new UI();

})(app, $);

/* ------------------------------------------------------------------------------------------------
## (DOCUMENTATION)
## ------------------------------------------------------------------------------------------------

	initTabs: jQuery Tabs
		jacklmoore.com/notes/jquery-tabs

## ------------------------------------------------------------------------------------------------
## END
## --------------------------------------------------------------------------------------------- */
