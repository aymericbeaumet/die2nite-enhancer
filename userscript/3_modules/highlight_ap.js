Module.register(function() {

    var MODULE_NAME = 'highlight_ap';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Highlight AP';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Add a border with a specific color (from red to green) in function of the remaining number of action point.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Colorer les PA';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Ajoute une bordure avec une couleur spécifique (du rouge au vert) en fonction du nombre de PA restant.';

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
                var highlight = function() {
                    D2N.get_number_of_ap(function(ap) {
                        var colors = [
                            'ff0000', // 0 AP
                            'ff4700', // 1 AP
                            'ff8e00', // 2 AP
                            'ffd500', // 3 AP
                            'e3ff00', // 4 AP
                            '9cff00', // 5 AP
                            '55ff00', // 6 AP
                            '00ff00'  // 7 AP+
                        ];

                        while (ap >= colors.length) {
                            --ap;
                        }

                        JS.injectCSS(
                            '#movesCounter {' +
                                'border: 1px solid #' + colors[ap] + ' !important;' +
                            '}'
                        );
                    });
                };

                // Highlight on change
                document.addEventListener('d2n_apchange', function() {
                    highlight();
                }, false);
            }
        }

    };
});
