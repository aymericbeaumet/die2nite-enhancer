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
        // Set default language
        I18N.set_language(D2N.get_website_language());
    }

    /**
     * Initialise every modules.
     */
    function initialise_modules()
    {
        Module.init();
    }

    /**
     * Disable all the external tools that do not match this domain.
     */
    function disable_inappropriate_external_tools()
    {
        Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
            // if the domain doesn't match, disable the module
            if (module.properties.tool.active_on !== D2N.get_website()) {
                module.disable();
            }
        });
    }

    /**
     * Load every enabled modules.
     */
    function load_modules()
    {
        // For each module
        Module.iterate_in_priority_order(function(module) {
            // Skip it if it is disabled
            if (!module.is_enabled()) {
                return;
            }

            // If the module has a 'load' method, call it and give 'module' as
            // the context to be able to reach its private membres and methods
            // via 'this'
            if (typeof module.actions.load !== 'undefined') {
                module.actions.load.call(module);
            }
        });

        // Send an event when all the modules are loaded
        JS.dispatch_event('d2ne_all_modules_loaded');
    }

    /**
     * Set all the api keys to 'null'.
     */
    function clean_api_keys()
    {
        Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
            module.properties.tool.api_key = null;
            module.save_config();
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
                if (module.properties.tool.api_key !== null) {
                    return;
                }

                // else fetch the key
                JS.network_request('GET',
                    '/disclaimer?id=' + module.properties.tool.directory_id + ';sk=' + sk, null, null,
                    function on_success(data, context) {
                        var match = data.match(/<input type="hidden" name="key" value="([a-f0-9]{38,39})"\/>/);
                        if (JS.is_defined(match) && match.length === 2) {
                            context.module.properties.tool.api_key = match[1];
                        } else {
                            context.module.properties.tool.api_key = null;
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
            initialise_modules();
            disable_inappropriate_external_tools();
            load_modules();

            D2N.is_logged(function(is_logged) { if (is_logged) {
                fetch_api_keys();
                clean_api_keys_if_on_settings_page();
                D2N.add_custom_events();
            }});
        }

    };

})();
