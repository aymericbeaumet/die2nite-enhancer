Module.register(function() {

    var MODULE_NAME = 'hero_bar_stat';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable hero bar stat';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'On soul page, enable days stat on the hero bar.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer le pourcentage sur la barre héros';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Sur la page d\'âme, active le pourcentage sur la barre héros.';

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
                category: Module.PROPERTY_CATEGORY.HERO,
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
                    'div.heroUpBar div.hfront {' +
                        'padding-left: 6px;' +
                        'text-align: center;' +
                        'font-family: "Century Gothic", "Arial", "Trebuchet MS", Verdana, sans-serif;' +
                        'font-size: 16pt;' +
                        'padding-top: 10px;' +
                        'color: #f0d79e;' +
                        'text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;' +
                    '}'
                );

                document.addEventListener('d2n_gamebody_reload', function() {
                    if (!(D2N.is_on_page('ghost') || D2N.is_on_page('ghost_exp'))) {
                        return;
                    }

                    JS.wait_for_selector('#ghostImg img', function(node) {
                        // abort if not hero
                        if (node.alt !== 'ghost red') {
                            return;
                        }

                        JS.wait_for_selector('#ghost_pages img.hbar', function(node) {
                            var width = parseFloat(node.style.width);
                            // Notes:
                            //   - day 0/XX -> 0px
                            //   - day 5/14 -> 210.714285714286px
                            //   - day 6/14 -> 252.857142857143px
                            //   - dat 7/14 -> 295px
                            var max_width = 583; //px
                            var percent = width / max_width * 100;

                            var fill_bar = function() {
                                JS.wait_for_selector('div.heroUpBar div.hfront', function(node) {
                                    node.textContent = parseInt(percent) + '%';
                                });
                            };
                            fill_bar();
                        });
                    });
                }, false);
            }
        }

    };
});
