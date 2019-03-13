Module.register(function() {

	var MODULE_NAME = 'external_sites';

	/******************
	 * Module context *
	 ******************/

	/**
	 * The external tools bar ID.
	 */
	var EXTERNAL_SITES_UPDATE_CONTAINER_ID = 'd2ne_external_sites_container';
   
	/**
	 * Cache
	 */
	var button_container_ = null;

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n() {
		var i18n = {};

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_disclaimer'] = 'Following links have been added by D2NE';

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_disclaimer'] = 'Les liens suivants ont été ajoutés par D2NE';

		I18N.set(i18n);
	}

	/**
	 * Inject the node composing the external sites into the DOM.
	 */
	function inject_external_sites_node() {
		// If the ul exists, abort
		if (JS.is_defined(document.getElementById(EXTERNAL_SITES_UPDATE_CONTAINER_ID))) {
			return;
		}

		// Define the reference node selector
		var selector = "#sites";

		JS.wait_for_selector(selector, function(node) {
			node.appendChild(JS.jsonToDOM(["p", {}, I18N.get(MODULE_NAME + '_disclaimer')], document));

			var reference_node = node.parentNode;

			// Create the new node
			var ul_container = JS.jsonToDOM(["ul", {"id":EXTERNAL_SITES_UPDATE_CONTAINER_ID}, ""], document);

			// Cache it
			button_container_ = ul_container;

			// Insert it
			node.appendChild(ul_container);
		}, 10);
	}

	/**
	 * Load the module.
	 */
	function load_module() {
		// Inject DOM
		inject_external_sites_node();
	}

	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.CONTAINER,

		properties: {
			enabled: true
		},

		container_id: EXTERNAL_SITES_UPDATE_CONTAINER_ID,

		actions: {
			can_run: function() {
				return true;
			},

			init: function(){
				add_i18n();
			},

			load: function() {
				var loaded = false;

				// inject the button if at least one external tool is enabled
				Module.iterate_on_type(Module.TYPE.EXTERNAL_SITE, function(module) {
					// if module is enabled, then the external tools bar has to
					// be enabled
					if (module.is_enabled()) {

						// Load the external tools bar module
						if(!loaded){
							load_module();
							// Ensure it loads only once
							loaded = true;
						}
						var dom = JS.jsonToDOM(["li", {}, 
							["a", { "href": module.properties.link.url, "class": "link", "target": "_blank"},
								["img", { "src": module.properties.link.icon, "width": "16px", "height": "16px" }],
								["div", {"style": "display: inline"}, " "],
								["span", {}, module.properties.link.title]
							]
						], document);

						// Append the module DOM
						JS.wait_for_id(EXTERNAL_SITES_UPDATE_CONTAINER_ID, function(node) {
							node.appendChild(dom);
						});
					}
				});
			},

			refresh: function(){
				on_update_button_click();
			}
		}

	};
});
