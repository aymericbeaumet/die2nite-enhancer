Module.register(function() {

    var MODULE_NAME = 'hide_hero_adds';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Hide hero adds';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Cacher les publicités pour le mode héros';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Cache les publicités pour le mode héros. C\'est pratique si vous êtes déjà héros ou si vous ne comptez pas le devenir.';

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
                category: Module.PROPERTY_CATEGORY.INTERFACE,
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
                JS.injectCSS(
                    '.heroMode, #ghostHeroAd, #heroContainer, .heroAd, #ghostHeroChoose, .promoBt, .sondageBg {' +
                        'display: none !important;' +
                    '}'
                );
            }
        }

    };
});
