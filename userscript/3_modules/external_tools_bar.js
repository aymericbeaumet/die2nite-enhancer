Module.register(function() {

    var MODULE_NAME = 'external_tools_bar';

    /******************
     * Module context *
     ******************/

    /**
     * The external tools bar ID.
     */
    var EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID = 'd2ne_external_tools_bar_update_container_id';
    var EXTERNAL_TOOLS_BAR_UPDATE_ID = 'd2ne_external_tools_bar_update_id';

    /**
     * Update state, an object containing objects of the following form:
     *
     *     var update_state_ = {
     *         "module_name": {
     *             name: "module_friendly_name",
     *             done: true,
     *             error: false
     *         },
     *         "module_name_2": {
     *             name: "module_2_friendly_name",
     *             done: true,
     *             error: true
     *         }
     *     };
     */
    var update_state_ = {};

    /**
     * Cache
     */
    var button_container_ = null;
    var button_hidden_div_ = null;
    var button_link_ = null;

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_update_button'] = 'Update the external tools';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_update_button'] = 'Mettre à jour les outils externes';

        I18N.set(i18n);
    }

    /**
     * Check if an update is in progress.
     */
    function is_update_in_progress()
    {
        return Object.keys(update_state_).length > 0;
    }

    /**
     * Reset the update state.
     */
    function reset_update()
    {
        update_state_ = {};
    }

    /**
     * Enable the button.
     */
    function enable_button()
    {
        button_link_.classList.remove('disabled');
    }

    /**
     * Disable the button.
     */
    function disable_button()
    {
        button_link_.classList.add('disabled');
    }

    /**
     * Get the number of external tools for the current update
     * @return integer The number of external tools
     */
    function get_number_of_external_tools()
    {
        return Object.keys(update_state_).length;
    }

    /**
     * Get the number of external tools update done.
     * @return integer The number of external tools update done
     */
    function get_number_of_external_tools_update_done()
    {
        var ret = 0;

        for (var key in update_state_) {
            ret += (update_state_[key].done === true) ? 1 : 0;
        }

        return ret;
    }

    /**
     * Set the size of the hidden div. Also enable/disable the button behind.
     * @param integer updated number of updated tools (with success or not)
     * @param integer total total number of tools
     */
    function update_hidden_div_width(updated, total)
    {
        var percent = (updated / total) * 100;

        // change the div width
        button_hidden_div_.style.width = (100 - percent) + '%';
    }

    /**
     * Update all the enabled external tools.
     * @param Function progress_callback Will be called on each state change
     */
    function update_external_tools(progress_callback)
    {
        // Abort if an update is already in progress
        if (is_update_in_progress()) {
            return;
        }

        // if first launch, update the hidden div width (0/100)
        update_hidden_div_width(0, 100);
        // and disable the button
        disable_button();

        Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
            if (!module.is_enabled()) {
                return;
            }

            update_state_[module.name] = {
                module: module,
                name: I18N.get(module.name + '_name'),
                done: false,
                error: false
            };

            module.actions.update.call(module, function on_success() {
                update_state_[module.name].done = true;
                update_state_[module.name].error = false;

                return progress_callback();

            }, function on_failure() {
                update_state_[module.name].done = true;
                update_state_[module.name].error = true;

                return progress_callback();
            });
        });
    }

    /**
     * Handle the click on the update button.
     */
    function on_update_button_click()
    {
        update_external_tools(function on_progress() {
            var number_of_tools = get_number_of_external_tools();
            var number_of_done = get_number_of_external_tools_update_done();

            update_hidden_div_width(number_of_done, number_of_tools);

            // if done
            if (number_of_done >= number_of_tools) {
                // finally reset the update
                reset_update();
                // enable the button
                enable_button();
            }
        });
    }

    /**
     * Inject the node composing the external tools bar into the DOM.
     */
    function inject_external_tools_bar_nodes()
    {
        var selector = null;

        // If the toolbar exists, abort
        if (JS.is_defined(document.getElementById(EXTERNAL_TOOLS_BAR_UPDATE_ID))) {
            return;
        }

        // Find the reference node
        if (D2N.is_on_page_in_city('bank')) {
            selector = 'a > img[src$="/gfx/icons/r_forum.gif"]';
        } else if (D2N.is_outside()) {
            selector = 'a > img[src$="/gfx/icons/small_hero.gif"]';
        } else {
            return;
        }

        JS.wait_for_selector(selector, function(node) {
            var reference_node = node.parentNode;

            // Create the new node
            var new_button = JS.jsonToDOM(
                ["div", { "id": EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID },
                    ["div", {}],
                    ["a", { "href": "javascript:void(0)", "class": "button", "id": EXTERNAL_TOOLS_BAR_UPDATE_ID,
                            "onclick": function() {
                                           if (this.classList.contains('disabled')) {
                                               return;
                                           }
                                           on_update_button_click();
                                       }
                          },
                        ["img", { "src": "/gfx/icons/r_explo2.gif", "width": "16px", "height": "16px" }],
                        ' ' + I18N.get(MODULE_NAME + '_update_button')
                    ]
                ]
            , document);

            // Cache it
            button_container_ = new_button;
            button_hidden_div_ = new_button.childNodes[0];
            button_link_ = new_button.childNodes[1];

            // If an update is in progress, disable it
            if (is_update_in_progress()) {
                disable_button();
            }
            // Then update the hidden div width
            update_hidden_div_width(get_number_of_external_tools_update_done(),
                                    get_number_of_external_tools());

            // Insert it
            JS.insert_after(reference_node, new_button);

            // Inject button again each time the gamebody is reloaded
            document.addEventListener('d2n_gamebody_reload', function() {
                inject_external_tools_bar_nodes();
            }, false);
        });
    }

    /**
     * Inject the external tool bar CSS.
     */
    function inject_external_tools_bar_style()
    {
        JS.injectCSS(
            '#' + EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID + ' {' +
                'position: relative;' +
                'top: 0;' +
                'left: 0;' +
            '}' +

            '#' + EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID + ' div {' +
                'position: absolute;' +
                'top: 0;' +
                'right: 0;' +
                'width: 0%;' +
                'height: 100%;' +
                'background-color: black;' +
                'opacity: 0.5;' +
            '}' +

            '#' + EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID + ' a.disabled {' +
                'padding-top: 0px;' +
                'padding-bottom: 1px;' +
                'color: #f0d79e;' +
                'border-top-width: 1px;' +
                'border-bottom-width: 2px;' +
                'outline: 1px solid #784323;' +
                'color: #f0d79e;' +
                'cursor: help;' +
            '}'

        );
    }


    /************************
     * Module configuration *
     ************************/

    return {

        name: MODULE_NAME,
        type: Module.TYPE.CONTAINER,

        properties: {
            enabled: true
        },

        actions: {
            can_run: function() {
                return true;
            },

            init: function(){
                add_i18n();
            },

            load: function() {
                inject_external_tools_bar_style();
                inject_external_tools_bar_nodes();
            }
        }

    };
});
