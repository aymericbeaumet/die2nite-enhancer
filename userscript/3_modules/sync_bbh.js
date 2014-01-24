Module.add((function() {

    /******************
     * Module context *
     ******************/

    var update_method_ = 'POST';
    var update_url_ = 'http://bbh.fred26.fr/update.php';


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'sync_bbh',
        type: Module.TYPE.EXTERNAL_TOOL,

        config: {
            enabled: false,
            tool: {
                active_on: 'www.hordes.fr',
                directory_id: 51,
                api_key: undefined
            }
        },

        action: {
            update: function(callback_success, callback_failure) {
                JS.network_request(
                    update_method_, update_url_,
                    'key=' + module_config.tool.api_key + '&action=force_maj',
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        // if response is too short, it is incomplete because
                        // the user is not logged
                        if (response_text.length < 20000) {
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
