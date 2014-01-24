Module.register((function() {

    var MODULE_NAME = 'sync_duskdawn';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable Dusk Dawn sync'; 
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Add the possibility to sync with Dusk Dawn';

        I18N.set(i18n);
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.EXTERNAL_TOOL,

        properties: {
            enabled: false,
            tool: {
                active_on: 'www.die2nite.com',
                directory_id: 14,
                api_key: null
            }
        },

        configurable: {
            enabled: {
                type: Module.PROPERTIES.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            init: function() {
                add_i18n();
            },

            update: function(callback_success, callback_failure) {
                // Do not update if not outside
                if (!D2N.is_outside()) {
                    return callback_success();
                }

                JS.network_request(
                    'POST',
                    'http://d2n.duskdawn.net/zone',
                    'key=' + module_config.tool.api_key,
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        var json = JSON.parse(response_text);
                        if ('errorCode' in json || 'errorMessage' in json) {
                            return callback_failure();
                        }
                        return callback_success();
                    },
                    function() {
                        return callback_failure();
                    }
                );
            }
        }

    };
})());
