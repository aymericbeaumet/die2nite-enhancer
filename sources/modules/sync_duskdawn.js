Module.register(function() {

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_name'] = 'From Dusk Till Dawn';
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
                directory_id: 14,
                api_key: null,
                update_method: 'POST',
                update_url: 'http://d2n.duskdawn.net/zone/extended'
            },
            isProtected: false
        },

        configurable: {
            enabled: {
                category: Module.PROPERTY_CATEGORY.EXTERNAL_TOOL,
                type: Module.PROPERTY.BOOLEAN,
                short_desc_I18N: MODULE_NAME + '_short_desc',
                full_desc_I18N: MODULE_NAME + '_full_desc'
            }
        },

        actions: {
            can_run: function() {
                return D2N.is_on_die2nite();
            },

            init: function() {
                add_i18n();
            },

            update: function(callback_success, callback_failure) {
                // Do not update if not outside
                if (!D2N.is_outside()) {
                    callback_failure();
                    return;
                }

                JS.network_request(
                    this.properties.tool.update_method,
                    this.properties.tool.update_url,
                    'key=' + this.properties.tool.api_key,
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        callback_success();
                    },
                    function() {
                        callback_failure();
                    }
                );
            }
        }

    };
});
