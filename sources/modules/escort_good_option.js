Module.register(function() {

    var MODULE_NAME = 'good_escort_options';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Directly enable the good escort options';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'When the escort mode is enabled, you can directly be taken further away and your rucksack objects can be manipulated.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Activer directement les bonnes options d\'escorte';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Quand le mode escorte est activé, vous pouvez directement être éloigné de la ville et les objets de votre sac peuvent être manipulés.';

        I18N.set(i18n);
    }

    function enable_rucksack_manipulation()
    {
        // Try to find the label
        JS.wait_for_selector('#generic_section div.who input[name="fullEscort"]:not(:checked)', function() {

            // Grab the session key
            D2N.get_session_key(function(sk) {

                // If has been found and is not checked, enable the bag access
                JS.injectJS('js.XmlHttp.get(' + JSON.stringify('user/toggleFullEscort?sk=' + sk) + ');');

                // This will trigger a 'd2n_gamebody_reload' event so this
                // function will be called again. But the second time the
                // unchecked label will not be found and nothing will happen
            });
        }, 0);
    }

    function disable_take_further_away_protection(onFinish)
    {
        // Try to find the label
        JS.wait_for_selector('#generic_section div.who input[name="onlyEscortToTown"]:checked', function() {

            // Grab the session key
            D2N.get_session_key(function(sk) {

                // If has been found and is checked, disable the protection
                JS.injectJS('js.XmlHttp.get(' + JSON.stringify('user/toggleEscortToTown?sk=' + sk) + ');');

                // This will trigger a 'd2n_gamebody_reload' event so this
                // function will be called again. But the second time the
                // checked label will not be found so the onFinish callback will
                // be called.
            });
        }, 0, function notFound() {
            onFinish();
        });
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
                document.addEventListener('d2n_gamebody_reload', function() {
                    // if not outside, abort
                    if (!D2N.is_outside()) {
                        return;
                    }

                    disable_take_further_away_protection(function onFinish() {
                        enable_rucksack_manipulation();
                    });
                }, false);
            }
        }

    };
});
