Module.register(function() {

    var MODULE_NAME = 'hide_twitter_share_button';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Hide the Twitter share button';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Hide the Twitter share button on the Gazette.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Cacher le bouton de partage Twitter';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Cache le bouton de partage Twitter sur la page de la Gazette.';

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
                category: Module.PROPERTY_CATEGORY.INTERFACE,
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
                    '#gameBodyLight ul.linkControl {' +
                        'display: none;' +
                    '}' +
                    '#gameBodyLight div.logControl {' +
                        'margin-top: 351px;' +
                    '}'
                );
            }
        }

    };
});
