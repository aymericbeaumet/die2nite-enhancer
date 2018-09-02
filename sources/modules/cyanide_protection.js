Module.register(function() {

    var MODULE_NAME = 'cyanide_protection';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable cyanide protection';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Avoid to eat cyanide by accident by deleting the link to use it.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_cyanide'] = 'Cyanide';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Protéger contre le cyanure';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Supprime le lien permettant l\'utilisation du cyanure pour éviter les accidents.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_cyanide'] = 'Cyanure';

        i18n[I18N.LANG.ES] = {};
        i18n[I18N.LANG.ES][MODULE_NAME + '_cyanide'] = 'Cianuro';

        i18n[I18N.LANG.DE] = {};
        i18n[I18N.LANG.DE][MODULE_NAME + '_cyanide'] = 'Cyanide';

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
                document.addEventListener('d2n_gamebody_reload', function() {
                    D2N.remove_player_action(I18N.get(MODULE_NAME + '_cyanide'));
                }, false);
            }
        }

    };
});
