Module.register(function() {

	var MODULE_NAME = 'gesthordes_link';

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
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = "Lien Gest'Hordes dans l'annuaire";
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = "Rajoute un lien vers Gest'Hordes dans l'annuaire.";

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
                url: 'https://gest-hordes.eragaming.fr',
                icon: "https://gest-hordes.eragaming.fr/images/favicon.gif",
                title: "Gest'Hordes"
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