Module.register(function() {

	var MODULE_NAME = 'find_item_in_bank';

	/******************
	 * Module context *
	 ******************/

	var FIND_ITEM_ID = 'd2ne_item_finder';

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Find item in bank';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Help you find an item in the bank';
		i18n[I18N.LANG.EN][MODULE_NAME + '_label'] = 'Select the item you want to find:';
		i18n[I18N.LANG.EN][MODULE_NAME + '_select_item'] = "--- Please select ---";

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Trouver un objet en banque';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Sur la page de la banque, affiche une liste des objets présent pour les repérer plus facilement.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_label'] = "Sélectionnez l'objet que vous recherchez";
		i18n[I18N.LANG.FR][MODULE_NAME + '_select_item'] = "--- Veuillez choisir ---";

		I18N.set(i18n);
	}

	function get_finder_div()
	{
		var json = [
			"div", { "id": FIND_ITEM_ID, "class": "extractCpt" },
			["img", { "src": "/gfx/forum/smiley/h_arrow.gif" }],
			' ' + I18N.get(MODULE_NAME + '_label') + ' ',
			["select", { "id": "finderSelect" }, ["option", {"value": ""}, I18N.get(MODULE_NAME + "_select_item")]]
		];

		$("ul.stocks li.multi a").each(function(){
			var mouseover = $(this).attr("onmouseover");
			mouseover = mouseover.substring(26).trim();
			mouseover = mouseover.substring(0, mouseover.indexOf("', '"));
			var title = mouseover.substring(0, mouseover.indexOf("<img")).trim();
			var img = mouseover.substring(mouseover.indexOf("<img")).trim();
			json[4].push(["option", {"value": title}, title]);
		});
		return JS.jsonToDOM(json, document);
	}

	function inject_finder()
	{
		if (!D2N.is_on_page_in_city('bank')) {
			return;
		}

		// Add finder
		var selector = "div.right";

		JS.wait_for_selector(selector, function(el) {
			var refNode = el.firstChild;
			if($("#d2ne_abuse_counter")) {
				refNode = refNode.nextSibling;
			}
			el.insertBefore(get_finder_div.call(this), refNode);
			$("#" + FIND_ITEM_ID + " select").change(function(){
				$(".itemLookup").removeClass("itemLookup");
				var text = $(this).val();
				if(text != "") {
					$("ul.stocks li.multi a[onmouseover*='" + text + "']").addClass("itemLookup");
				}
			});
		}.bind(this));
		
		JS.injectCSS(
			"#finderSelect {" +
				"width: 100%;" +
			"}" + 
			".itemLookup {" +
				"background: yellow;" +
				"transition: all 0.5s ease;" +
			"}" +
			"#" + FIND_ITEM_ID + " { " +
				"cursor: auto;" +
				"padding-right: 6px;"  +
			"}"
		);
	}



	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.INTERFACE_ENHANCEMENT,

		properties: {
			enabled: false,
            isProtected: false
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.BANK,
				type: Module.PROPERTY.BOOLEAN,
				short_desc_I18N: MODULE_NAME + '_short_desc',
				full_desc_I18N: MODULE_NAME + '_full_desc'
			}
		},

		actions: {
			can_run: function() {
				return true;
			},

			init: function() {
				add_i18n();
			},

			load: function() {
				document.addEventListener('d2n_gamebody_reload', function() {
					if (!D2N.is_on_page_in_city('bank')) {
						return;
					}

					if (JS.is_defined(document.getElementById(FIND_ITEM_ID))) {
						return;
					}

					inject_finder.call(this);

				}.bind(this), false);
			}
		}

	};
});
