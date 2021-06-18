Module.register(function() {

	var MODULE_NAME = 'link_argordien';

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
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = "Lien Argordien dans l'annuaire";
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = "Rajoute un lien vers l'Argordien dans l'annuaire.";

		I18N.set(i18n);
	}

	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.EXTERNAL_SITE,

		properties: {
			enabled: false,
			isProtected: false,
			link: {
                url: 'https://d2ne.datw.tf/argordien/',
                icon: "https://d2ne.datw.tf/argordien/favicon.png",
                title: "Argordien"
            },
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.SITES,
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
			}
		}

	};
});