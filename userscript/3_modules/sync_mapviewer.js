Module.register((function() {

    var MODULE_NAME = 'sync_mapviewer';

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
        i18n[I18N.LANG.EN][MODULE_NAME + '_short_desc'] = 'Enable Map Viewer sync'; 
        i18n[I18N.LANG.EN][MODULE_NAME + '_full_desc'] = 'Add the possibility to sync with Map Viewer';

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
                directory_id: 1,
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
                JS.network_request(
                    'GET',
                    'http://die2nite.gamerz.org.uk/ajax/update_current_zone',
                    'key=' + localStorage[this.get_local_storage_key()],
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    function(response_text) {
                        try {
                            var json = JSON.parse(response_text);
                            if ('status' in json && json.status == 1) {
                                return callback_success();
                            }
                            return callback_failure();
                        } catch (e) {
                            return callback_failure();
                        }
                    },
                    function() {
                        return callback_failure();
                    }
                );
            }
        }

    };
})());
