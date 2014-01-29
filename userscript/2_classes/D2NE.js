/******************************************************************************
 *                                                                            *
 *  Die2Nite Enhancer class                                                   *
 *                                                                            *
 ******************************************************************************/

var D2NE = (function() {

/*
  private:
*/

    /**
     * The different module types (the order matters).
     */
    var TYPES = [
        'BUSINESS_LOGIC', // Used by business logic modules
        'CONTAINER', // Used by the containers modules
        'INTERFACE_ENHANCEMENT', // Used to customise the interface
        'EXTERNAL_TOOL' // Used to synchronise with external tools
    ];

    function configure_module_class()
    {
        // Define the types
        TYPES.forEach(function(type) {
            Module.add_type(type);
        });

        // The types will be loaded in this order
        Module.set_types_loading_order(TYPES);
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
            // the context to be able to reach its private members and methods
            // via 'this'
            if (typeof module.actions.load !== 'undefined') {
                module.actions.load.call(module);
            }

            emit_all_modules_loaded_event_if_needed((initialised_modules += 1), total_modules);
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

            D2N.add_custom_events();
        }

    };

})();
