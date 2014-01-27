/******************************************************************************
 *                                                                            *
 *  Die2Nite Enhancer class                                                   *
 *                                                                            *
 ******************************************************************************/

var D2NE = (function() {

/*
  private:
*/

    function configure_module_class()
    {
        // Used by the passive containers
        Module.add_type('CONTAINER');
        // Used to custom the interface
        Module.add_type('INTERFACE_ENHANCEMENT');
        // Used to sync. external tools
        Module.add_type('EXTERNAL_TOOL');


        // The modules will be loaded in this order
        Module.set_type_loading_order([
            'CONTAINER',
            'INTERFACE_ENHANCEMENT',
            'EXTERNAL_TOOL'
        ]);
    }

    function configure_storage_class()
    {
        // Set storage prefix
        Storage.set_key_prefix('extensions.d2ne.');
    }

    function configure_internationalisation_class()
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
     * Send the 'all_modules_loaded' if needed.
     */
    function emit_all_modules_loaded_event_if_needed(initialised_modules, total_modules)
    {
        if (initialised_modules >= total_modules) {
            // Dispatch an event when all the modules are loaded
            JS.dispatch_event('d2ne_all_modules_loaded');
        }
    }

    /**
     * Load every enabled modules.
     */
    function load_modules()
    {
        var initialised_modules = 0;
        var total_modules = Module.count();

        // For each module
        Module.iterate_in_priority_order(function(module) {
            // Skip it if it is disabled
            if (!module.is_enabled()) {
                emit_all_modules_loaded_event_if_needed(initialised_modules, (total_modules -= 1));
                return;
            }

            // If the module has a 'load' method, call it and give 'module' as
            // the context to be able to reach its private membres and methods
            // via 'this'
            if (typeof module.actions.load !== 'undefined') {
                module.actions.load.call(module);
            }

            emit_all_modules_loaded_event_if_needed((initialised_modules += 1), total_modules);
        });
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

            D2N.get_api_key(module.properties.tool.directory_id, function onsuccess(key) {
                module.properties.tool.api_key = key;
                module.save_config();
            }, function onfailure() {
                module.properties.tool.api_key = null;
                module.save_config();
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
            configure_module_class();
            configure_storage_class();
            configure_internationalisation_class();

            initialise_modules();
            load_modules();

            D2N.is_logged(function(is_logged) { if (is_logged) {
                fetch_api_keys();
                clean_api_keys_if_on_settings_page();
                D2N.add_custom_events();
            }});
        }

    };

})();
