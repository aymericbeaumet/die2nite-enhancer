Module.register(function() {

    var MODULE_NAME = 'remove_soul_distinctions_scrollbar';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Remove the soul distinctions scrollbar';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'On the soul page, remove the soul distinctions scrollbar';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Enlever la barre de défilement des distinctions';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Sur la page d\'âme, enlève la barre de défilement des distinctions.';

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
                category: Module.PROPERTY_CATEGORY.SOUL,
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
                    '.tid_goalListWrapper, .tid_reachList {' +
                        'max-height: none !important;' +
                    '}' +
                    '.tid_bg2.tid_border2.tid_scrollBar {' +
                        'display: none;' +
                    '}' +
                    '.tid_bg3.tid_border3.tid_scrollTrack {' +
                        'height: auto;' +
                    '}' +
                    '.tid_scrollContentWrapper {' +
                        'overflow: visible;' +
                        'max-height: none;' +
                        'margin-right: 0;' +
                        'padding-top: 4px;' +
                    '}'
                );
            }
        }

    };
});
