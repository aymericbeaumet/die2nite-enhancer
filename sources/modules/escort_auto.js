Module.register(function() {

    var MODULE_NAME = 'auto_escort';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Auto escort';
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Automatically enable the escort mode when outside.';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_short_desc'] = 'Attendre une escorte automatiquement';
        i18n[I18N.LANG.FR][MODULE_NAME + '_full_desc'] = 'Active automatiquement le mode escorte lorsque vous êtes hors de la ville.';

        I18N.set(i18n);
    }

    function enable_escort(sk)
    {
      // If the escort link is found
      JS.wait_for_selector('#generic_section div.who a[href^="#user/waitForLeader?sk="]', function() {

        // Grab the session key
        D2N.get_session_key(function(sk) {

          // Enable the escort
          JS.injectJS('js.XmlHttp.get(' + JSON.stringify('user/waitForLeader?sk=' + sk) + ');');
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

                    enable_escort();
                }, false);
            }
        }

    };
});
