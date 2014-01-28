Module.register(function() {

    var MODULE_NAME = 'fetch_api_keys';

    /******************
     * Module context *
     ******************/

    /**
     * Set all the api keys to 'null'.
     */
    function clean_api_keys()
    {
        Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
            module.properties.tool.api_key = null;
            module.save_properties();
        });
    }

    /**
     * Register to the 'gamebody_reload' event to clean the api keys when the
     * user go to the settings page.
     */
    function clean_api_keys_if_on_settings_page()
    {
        document.addEventListener('d2n_gamebody_reload', function() {
            if (!D2N.is_on_page('settings')) {
                return;
            }

            clean_api_keys();
        });
    }

    /**
     * Called when the API key is successfully fetched.
     * @param Object module The module
     * @param string key The API key
     */
    function on_api_key_successfully_fetched(module, key)
    {
        module.properties.tool.api_key = key;
        module.save_properties();
    }

    /**
     * Called when the API key can't be fetched.
     * @param Object module The module
     */
    function on_api_key_fetch_error(module)
    {
        module.properties.tool.api_key = null;
        module.save_properties();
    }

    /**
     * Fetch the api keys for each available external tool.
     */
    function fetch_api_keys()
    {
        // Abort if on the settings page
        if (D2N.is_on_page('settings')) {
            return;
        }

        // Get the api key for each module
        Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
            // if module is disabled, abort
            if (!module.is_enabled()) {
                return;
            }

            // if the key has already been fetched, abort
            if (module.properties.tool.api_key !== null) {
                return;
            }

            // else try to fetch it
            D2N.get_api_key(module.properties.tool.directory_id, function on_success(key) {
                on_api_key_successfully_fetched(module, key);
            }, function on_failure() {
                on_api_key_fetch_error(module);
            });
        });
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.BUSINESS_LOGIC,

        properties: {
            enabled: false,
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function() {
                D2N.is_logged(function(is_logged) { if (is_logged) {
                    document.addEventListener('d2ne_all_modules_loaded', function() {
                        fetch_api_keys();
                        clean_api_keys_if_on_settings_page();
                    }, false);
                }});
            }
        }

    };
});
