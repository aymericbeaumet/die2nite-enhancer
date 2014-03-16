Module.register(function() {

    var MODULE_NAME = 'hide_help';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Hide help';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Hide all the helps in the interface.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Cacher les aides';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Cache les aides de jeu dans toute l\'interface.';

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
                    '#mapTips, a.button[href^="#city/exp?editor=1;sk="] + p, .helpLink:not(#d2ne_configuration_panel .helpLink), #generic_section > div > em:last-of-type, .help, .heroHelp {' +
                        'display: none;' +
                    '}'
                );

                document.addEventListener('d2n_gamebody_reload', function() {
                    if (!(D2N.is_on_page_in_city('guard'))) {
                        return;
                    }

                    // As the watch button is in a help div, if the help is hidden
                    // the button disappeared. So in this case the button is moved
                    // elsewhere in the DOM.
                    var hide_help_module = Module.get('hide_help');
                    if (hide_help_module !== null && hide_help_module.is_enabled()) {
                        JS.wait_for_class('help', function(help) {
                            JS.wait_for_selector('#generic_section a.button', function(button) {
                                button.style.marginTop = '18px';
                                button.style.marginBottom = '15px';
                                help[0].parentNode.insertBefore(button, help[0]);
                            });
                        });
                    }
                }, false);
            }
        }

    };
});
