Module.register(function() {

	var MODULE_NAME = 'forum_protection';

	/******************
	 * Module context *
	 ******************/

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable forum post protection';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Avoid your post on the forum from being altered by the alcohol or the terror.';

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = "Protéger contre les effets sur les messages du forum";
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = "Empêche le message posté sur le forum d'être altéré par les effets de l'alcool ou de la terreur.";

		I18N.set(i18n);
	}


	/************************
	 * Module configuration *
	 ************************/

	return {

		name: MODULE_NAME,
		type: Module.TYPE.INTERFACE_ENHANCEMENT,

		properties: {
			enabled: false,
			isProtected: true
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.GENERAL,
				type: Module.PROPERTY.BOOLEAN,
				short_desc_I18N: MODULE_NAME + '_short_desc',
				full_desc_I18N: MODULE_NAME + '_full_desc'
			}
		},

		actions: {
			can_run: function() {
				return !D2NE.is_restricted_mode();
			},

			init: function() {
				add_i18n();
			},

			load: function() {
				if(!D2N.is_on_forum()){
					return;
				}
				
				document.addEventListener('d2n_forum_topic', function() {
					if(!D2N.is_on_forum()){
						return;
					}

					// Requête GET sur https://qaz.wtf/u/convert.cgi?text=[Contenu du champ texte]
				}, false);
			}
		}

	};
});
