Module.add((function() {

    /******************
     * Module context *
     ******************/


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'sync_mapviewer',
        type: Module.TYPE.EXTERNAL_TOOL,

        config: {
            enabled: false,
            tool: {
                active_on: 'www.die2nite.com',
                directory_id: 1,
                api_key: null
            }
        },

        action: {
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
