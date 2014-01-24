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
     * Fetch the external tools private keys.
     */
    function fetch_tools_private_keys()
    {
        // Drop private key cache when the user go on the settings page
        // (potential API key reset)
        document.addEventListener('d2n_gamebody_reload', function() {
            if (!D2N.is_on_page('settings')) {
                return;
            }

            // Clean the cache for all the external tools
            for (var i = 0, max = external_tools_.length; i < max; ++i) {
                localStorage[external_tools_[i].get_local_storage_key()] = null;
            }
        });

        // Abort if on the settings page
        if (D2N.is_on_page('settings')) {
            return;
        }

        // Display the given button by setting its parent node display CSS
        // property
        var enable_button = function(button_id) {
            JS.wait_for_id(button_id, function(node) {
                node.parentNode.style.display = 'block'; // display the concerned row
            });
        };

        var enable_tool_in_config_panel, tool_info, match;
        D2N.get_sk(function(sk) {

            // Browse all the external tools
            for (var i = 0, max = external_tools_.length; i < max; ++i) {
                var tool = external_tools_[i];
                var configuration_panel_id = CONFIGURATION_PANEL_ID_PREFIX_EXTERNAL_TOOLS + '_' + tool.name;

                // if this tool is disabled, go to the next one
                if (localStorage[tool.get_local_storage_key()] == -1) {
                    continue;
                }

                // if the tool is not adapted to this website, disable it and
                // skip to the next one
                if (!(D2N.get_website() in tool.site_id)) {
                    localStorage[tool.get_local_storage_key()] = -1;
                    continue;
                }

                // if key already exists, enable config panel corresponding
                // button and skip to the next tool
                if (JS.match_regex(localStorage[tool.get_local_storage_key()], '^[a-f0-9]{38,39}$')) {
                    enable_button(configuration_panel_id);
                    continue;
                }

                // Else fetch its key, enable the button if needed
                JS.network_request('GET', '/disclaimer?id=' + tool.site_id[D2N.get_website()] + ';sk=' + sk, null, null,
                    function on_success(data, context) {
                        match = data.match(/<input type="hidden" name="key" value="([a-f0-9]{38,39})"\/>/);
                        if (JS.is_defined(match) && match.length === 2) {
                            localStorage[context.local_storage_key] = match[1]; // save the API key
                            enable_button(context.configuration_panel_id);
                        } else {
                            localStorage[context.local_storage_key] = -1; // disable this tool
                        }
                    }, null,
                    {
                        local_storage_key: tool.get_local_storage_key(),
                        configuration_panel_id: configuration_panel_id
                    } // context given to callback
                );
            }
        });
    }

/*
  public:
*/

    return {

        /**
         * Set up the script.
         */
        init: function()
        {
            // Configure Storage
            Storage.set_key_prefix('extensions.d2ne.');

            // Configure I18N
            I18N.set_language(D2N.get_website_language());

            // For each module
            Module.iterate_in_priority_order(function(module) {
                // Fetch its configuration from the Storage
                var storage_config = Storage.get('module.' + module.name);
                // Merge it into the default module configuration
                var config = JS.merge(module.config, storage_config);
                // Reinject the config in the loaded module
                module.config = config;

                // If the module has a 'load' method, call it
                if (typeof module.action.load !== 'undefined') {
                    console.log(module);
                    module.action.load.call(module);
                    console.log('LOADED');
                }
            });
        }

    };

})();
