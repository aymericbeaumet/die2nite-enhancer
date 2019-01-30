Module.register(function() {

	var MODULE_NAME = 'postit';

	/******************
	 * Module context *
	 ******************/

	var POSTIT_BASE_CLASS = 'd2ne_postit';

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Post-it';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Display some post-its where you need them.';

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Ajouter des post-its';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Ajoute des post-its où vous en avez besoin.';


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
				return true;
			},

			init: function() {
				add_i18n();
			},

			load: function() {
				JS.injectCSS(
					'#' + POSTIT_BASE_CLASS + ' {' +
						'cursor: auto;' +
					'}');

				document.addEventListener('d2n_gamebody_reload', function() {
					
				}.bind(this), false);
			}
		}

	};
});
