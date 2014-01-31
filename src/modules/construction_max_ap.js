Module.register(function() {

    var MODULE_NAME = 'construction_max_ap';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Use max AP in constructions';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'While in the construction page, use your actual number of AP instead of the default 1 AP.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Construire avec un maximum de PA';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Utilise le maximum de PA disponible pour les constructions au lieu de 1 par défaut.';

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
                category: Module.PROPERTY_CATEGORY.CITIZEN,
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
                var change_ap = function() {
                    if (!D2N.is_on_page_in_city('buildings')) {
                        return;
                    }

                    D2N.get_number_of_ap(function(ap) {
                        JS.wait_for_selector('tr.banner.root_wall1', function() {
                            var fields = document.querySelectorAll('div[id^="moreForm_"] form input[type="text"]');
                            var fields_length = fields.length;

                            for (var i = 0; i < fields_length; i += 1) {
                                fields[i].value = ap;
                            }
                        });
                    });
                };

                document.addEventListener('d2n_apchange', function() {
                    change_ap();
                }, false);
            }
        }

    };
});
