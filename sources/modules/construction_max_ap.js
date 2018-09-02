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
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Construire et réparer avec un maximum de PA';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Pré-remplit la case pour construire ou réparer un chantier avec le maximum de PA disponible au lieu de 1 par défaut.';

        I18N.set(i18n);
    }

    function change_ap()
    {
        D2N.get_number_of_ap_cp(function(ap) {
            var constructions = JS.nodelist_to_array(document.querySelectorAll('tr.building'));

            constructions.forEach(function(construction) {
                var ap_remaining = null;

                var tmp = construction.getElementsByClassName('rscItem');
                if (tmp.length < 1) {
                    return;
                }

                ap_remaining = parseInt(tmp[0].textContent);

                var max_ap = (ap_remaining > ap) ? ap : ap_remaining;
                var ap_field = construction.querySelector('div[id^="moreForm_"] form input[type="text"]');

                ap_field.value = max_ap;
            });
        });
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.INTERFACE_ENHANCEMENT,

        properties: {
            enabled: false,
            isProtected: false
        },

        configurable: {
            enabled: {
                category: Module.PROPERTY_CATEGORY.CONSTRUCTION,
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
                document.addEventListener('d2n_apchange', function() {
                    if (!D2N.is_on_page_in_city('buildings')) {
                        return;
                    }
                    change_ap();
                }, false);
            }
        }

    };
});
