/******************************************************************************
 *                                                                            *
 *  Die2Nite Enhancer class                                                   *
 *                                                                            *
 ******************************************************************************/

var D2NE = (function() {

/*
  private:
*/

    function configure_storage()
    {
        Storage.set_key_prefix('extensions.d2ne.');
    }

    function configure_internationalisation()
    {
        I18N.set_language(D2N.get_website_language());
    }

    /**
     * Load every enabled modules.
     */
    function load_modules()
    {
        // For each module
        Module.iterate_in_priority_order(function(module) {
            // Fetch its configuration from the Storage
            var storage_config = JSON.parse(Storage.get(module.get_storage_key()));
            // Merge it into the default module configuration
            var config = JS.merge(module.config, storage_config);

            // If the module is disabled, skip it
            if (!config.enabled) {
                return;
            }

            // Reinject the config into the loaded module
            module.config = config;

            // If the module has a 'load' method, call it and give 'module' as
            // the context
            if (typeof module.action.load !== 'undefined') {
                module.action.load.call(module);
            }
        });
    }

    /**
     * Set all the api keys to 'null'.
     */
    function clean_api_keys()
    {
        Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
            module.config.tool.api_key = null;
            module.save_config();
        });
    }

    /**
     * Register to the 'gamebody_reload' event to delete the api keys when the
     * user go to the settings page.
     */
    function clean_api_keys_on_settings_page()
    {
        document.addEventListener('d2n_gamebody_reload', function() {
            if (!D2N.is_on_page('settings')) {
                return;
            }

            clean_api_keys();
        });
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

        // Fetch the session key
        D2N.get_session_key(function(sk) {
            // Get the api key for each module
            Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
                // if module is disabled, abort
                if (!module.is_enabled()) {
                    return;
                }

                // if the key has already been fetched, abort
                if (module.config.tool.api_key !== null) {
                    return;
                }

                // if the domain doesn't match, disable the module and abort
                if (module.config.tool.active_on !== D2N.get_website()) {
                    module.disable();
                    return;
                }

                // else fetch the key
                JS.network_request('GET',
                    '/disclaimer?id=' + module.config.tool.directory_id + ';sk=' + sk, null, null,
                    function on_success(data, context) {
                        var match = data.match(/<input type="hidden" name="key" value="([a-f0-9]{38,39})"\/>/);
                        if (JS.is_defined(match) && match.length === 2) {
                            context.module.config.tool.api_key = match[1];
                        } else {
                            context.module.config.tool.api_key = null;
                        }
                        context.module.save_config();
                    }, null,
                    { module: module } // context given to callback
                );
            });
        });
    }



/*
  public:
*/

    return {

        /**
         * Initialise the script.
         */
        init: function()
        {
            configure_storage();
            configure_internationalisation();
            load_modules();

            D2N.is_logged(function(logged) { if (logged) {
                clean_api_keys_on_settings_page();
                fetch_api_keys();
                D2N.add_custom_events();
            }});
        }

    };

})();
