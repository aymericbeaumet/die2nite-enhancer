Module.register(function() {

	var MODULE_NAME = 'despair_death';

	/******************
	 * Module context *
	 ******************/

	 var DESPAIR_DEATH_ID = 'd2ne_despair_death';

	/**
	 * Add the i18n strings for this module.
	 */
	function add_i18n()
	{
		var i18n = {};

		i18n[I18N.LANG.FR] = {};
		i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Afficher les morts par désespoir';
		i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Affiche la quantité de zombies à tuer pour tuer la totalité des zombies présents sur une case.';
		i18n[I18N.LANG.FR][MODULE_NAME + '_to_kill'] = 'Zombies à tuer';

		i18n[I18N.LANG.EN] = {};
		i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Display deaths by despair';
		i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Shows the amount of zombies to kill for the others to die from despair.';
		i18n[I18N.LANG.EN][MODULE_NAME + '_to_kill'] = 'Zombies to kill';

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
			isProtected: false
		},

		configurable: {
			enabled: {
				category: Module.PROPERTY_CATEGORY.OUTSIDE,
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
					if(!D2N.is_outside()){
						return;
					}

					var nbZeds = parseInt($("#zombiePts").text());

					var nbKills = 0;

					if(nbZeds > 0) {
						nbKills = Math.round(nbZeds / 1.5 + 1);
					}

					if($("#" + DESPAIR_DEATH_ID).length == 0) {
						$("#sideMap").after("<div id='" + DESPAIR_DEATH_ID+ "' class='block'><div class='header'></div><div class='bg content'>" + I18N.get(MODULE_NAME + "_to_kill") + " : " + nbKills + "</div><div class='footer'></div></div>");
					} else {
						$("#" + DESPAIR_DEATH_ID + " .content").text("Zombies à tuer : " + nbKills);
					}
				}, false);
			}
		}
	};
});
