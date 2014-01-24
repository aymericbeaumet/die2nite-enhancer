Module.add((function() {

    /******************
     * Module context *
     ******************/

    var update_method_ = 'POST';
    var update_url_ = 'http://www.oeev-hordes.com/';


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'sync_oeev',
        type: Module.TYPE.EXTERNAL_TOOL,

        config: {
            enabled: false,
            tool: {
                active_on: 'www.hordes.fr',
                directory_id: 22,
                api_key: undefined
            }
        },

        action: {
            update: function(callback_success, callback_failure) {
                JS.network_request(
                    update_method_, update_url_,
                    'key=' + module_config.tool.api_key + '&mode=json',
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        var json = JSON.parse(response_text);
                        if ('response' in json && json.response === 'Site mis à jour') {
                            return callback_success();
                        }
                        return callback_failure();
                    },
                    function() {
                        return callback_failure();
                    }
                );
            }
        }

    };
})());
