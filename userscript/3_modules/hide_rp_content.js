Module.register(function() {

    var MODULE_NAME = 'hide_rp_content';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Hide RP content';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Hide all the RP content.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Cacher le contenu RP';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Cache le contenu RP (Role-Play).';

        I18N.set(i18n);
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false
        },

        configurable: {
            enabled: {
                type: Module.PROPERTIES.BOOLEAN,
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
                    '.ambiant, .flavor {' +
                        'display: none;' +
                    '}'
                );
            }
        }

    };
});
