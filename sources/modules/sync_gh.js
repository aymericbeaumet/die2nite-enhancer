Module.register(function() {

	var MODULE_NAME = 'sync_gh';
	var GHURL = "https://gest-hordes.eragaming.fr";
	/******************
	 * Module context *
	 ******************/

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_name'] = "Gest'Hordes";
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = "Activer la synchronisation Gest'Hordes";
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = "Ajoute la possibilité de synchroniser avec Gest'Hordes.";

		I18N.set(i18n);
	}

	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.EXTERNAL_TOOL,

		properties: {
			enabled: false,
			tool: {
				directory_id: 199,
				api_key: null,
				update_method: 'GET',
				update_url: 'https://gest-hordes.eragaming.fr/'
			},
			isProtected: false
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.EXTERNAL_TOOL,
				type: Module.PROPERTY.BOOLEAN,
				short_desc_I18N: MODULE_NAME + '_short_desc',
				full_desc_I18N: MODULE_NAME + '_full_desc'
			}
		},

		actions: {
			can_run: function() {
				return D2N.is_on_hordes();
			},

			init: function() {
				add_i18n();
			},

			update_gest: function(callback_success, callback_failure) {
				JS.network_request(
					"GET",
					GHURL + "/?reset",
					null,
					null,
					function() {
						return callback_success();
					},
					function() {
						return callback_failure();
					}
				);
			},

			update: function(callback_success, callback_failure) {
				var update_gest = this.actions.update_gest;
                JS.network_request(
                    "GET",
                    GHURL + "/?connexion",
                    null,
                    null,
                    function () {
                        update_gest(callback_success, callback_failure);
                    },
                    function () {
                        return callback_failure();
                    }
                );
			}
		}

	};
});
