Module.register(function() {

    var MODULE_NAME = 'external_tools_bar';

    /******************
     * Module context *
     ******************/

    /**
     * Remember if an external tool update is currently in progress.
     */
    var update_in_progress_ = false;

    /**
     * Update the external tools
     */
    function update_tools()
    {
        var tools_updated = 0;
        var tools_update_aborted = 0;
        var tools_number = 0;

        // Disable the toolbar
        var disable_toolbar = function() {
            update_in_progress_ = true;
            JS.wait_for_id(DOM_PREFIX + '_external_tools_bar_update', function(node) {
                node.classList.add('off');
            });
        };

        // Enable the toolbar
        var enable_toolbar = function() {
            JS.wait_for_id(DOM_PREFIX + '_external_tools_bar_update', function(node) {
                update_in_progress_ = false;
                node.classList.remove('off');
            });
        };

        // if an update is in progress, abort
        if (update_in_progress_) {
            return;
        }

        // else disable bars
        disable_toolbar();

        var images = document.querySelectorAll('#' + DOM_PREFIX + '_external_tools_bar a img');

        // Replace the toolbar icon with a calim
        var show_calim = function() {
            images[0].style.display = 'inline';
            images[1].style.display = 'none';
            images[2].style.display = 'none';
            images[3].style.display = 'none';
        };

        // Replace the toolbar icon with a loading wheel
        var show_loading_wheel = function() {
            images[0].style.display = 'none';
            images[1].style.display = 'inline';
            images[2].style.display = 'none';
            images[3].style.display = 'none';
        };

        // Replace the toolbar icon with a smile
        var show_smile = function() {
            images[0].style.display = 'none';
            images[1].style.display = 'none';
            images[2].style.display = 'inline';
            images[3].style.display = 'none';
        };

        // Replace the toolbar icon with a skull
        var show_skull = function() {
            images[0].style.display = 'none';
            images[1].style.display = 'none';
            images[2].style.display = 'none';
            images[3].style.display = 'inline';
        };

        // Is called after each update
        var handle_tool_update = function() {
            // if all requests are done, reenable the button
            if ((tools_updated + tools_update_aborted) === tools_number) {
                enable_toolbar();
            }

            // if error, show skull
            if (tools_update_aborted > 0) {
                return show_skull();
            }

            // if all success, show happy smile and abort
            if (tools_updated === tools_number) {
                return show_smile();
            }
        };

        disable_toolbar();
        show_loading_wheel();

        for (var i = 0, max = external_tools_.length; i < max; ++i) {
            var tool = external_tools_[i];

            // if tool isn't enabled, skip it
            if (!(configuration_.enable_sync[tool.name])) {
                continue;
            }

            // if key hasn't been found, skip it
            if (!JS.is_defined(localStorage[tool.get_local_storage_key()])) {
                continue;
            }

            // else update it
            ++tools_number;
            tool.update(function(response) {
                tools_updated += 1;
                handle_tool_update();
            }, function(response) {
                tools_update_aborted += 1;
                handle_tool_update();
            });
        }
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.CONTAINER,

        properties: {
            enabled: false
        },

        actions: {
            can_run: function() {
                return true;
            },

            load: function() {
            }
        }

    };
});
