Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'sync_duskdawn',
        type: Module.TYPE.EXTERNAL_TOOL,

        config: {
            enabled: false,
            tool: {
                active_on: 'www.die2nite.com',
                directory_id: 14,
                api_key: null
            }
        },

        action: {
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
