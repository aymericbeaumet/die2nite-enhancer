Module.register(function() {

    var MODULE_NAME = 'hide_city_outside_zones_banners';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Hide the city and outside zones banners'; 
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Hide the banner on the top of the screen when in city or outside.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Cacher la bannière en ville ou dehors';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Cache l\'image en haut de l\'écran représentant le lieu où vous êtes quand vous vous situez en ville ou dehors.';

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
                    'div.sectionArt {' +
                    'display: none;' +
                    '}'
                );
            }
        }

    };
});
