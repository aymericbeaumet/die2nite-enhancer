Module.register(function() {

    var MODULE_NAME = 'external_tools_bar';

    /******************
     * Module context *
     ******************/

    /**
     * The external tools bar ID.
     */
    var EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID = 'd2ne_external_tools_bar_update_container';
    var EXTERNAL_TOOLS_BAR_UPDATE_ID = 'd2ne_external_tools_bar_update';
    var EXTERNAL_TOOLS_TOOLTIP_LIST_ID = 'd2ne_external_tools_tooltip_list';

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
     * Store if an update is currently in progress.
     */
    var update_in_progress_ = false;

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
        return update_in_progress_;
    }

    /**
     * Setter for update_in_progress_.
     * @param boolean value The desired value (true for update, false otherwise)
     */
    function set_update_in_progress(value)
    {
        update_in_progress_ = value;
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
    function get_number_of_external_tool_updates_done()
    {
        var ret = 0;

        for (var key in update_state_) {
            if (update_state_.hasOwnProperty(key)) {
                ret += (update_state_[key].done === true) ? 1 : 0;
            }
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

        // Remove transition if not needed
        if (percent <= 0) {
            button_hidden_div_.classList.remove('smooth_transition');
        // Else add it
        } else {
            button_hidden_div_.classList.add('smooth_transition');
        }

        // change the div width
        button_hidden_div_.style.width = (100 - percent) + '%';
    }

    /**
     * Update the popup content.
     */
    function update_tooltip()
    {
        var element_id = EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID;
        var new_content = '';

        // set the content
        new_content += '<div id="' + EXTERNAL_TOOLS_TOOLTIP_LIST_ID + '" style="margin-top: 0;">';
        for (var tool in update_state_) {
            if (update_state_.hasOwnProperty(tool)) {
                // if done and success
                if (update_state_[tool].done === true) {
                    if (update_state_[tool].error === false) {
                        new_content += '<div style="color: #27F037;">';
                    } else {
                        new_content += '<div style="color: #EE1515;">';
                    }
                } else if(update_state_[tool].updating === true) {
                    new_content += '<div style="color: #ffd500;">';
                } else {
                    new_content += '<div>';
                }

                // Include title
                new_content += update_state_[tool].name + '</div>';
            }
        }
        new_content += '</div>';

        // Update the listeners
        JS.injectJS(
            'var el = document.getElementById(' + JSON.stringify(element_id) + ');' +
            'el.onmouseover = function(event) {' +
                'return js.HordeTip.showSpecialTip(this, \'helpTip\', \'\', ' + JSON.stringify(new_content) + ', event);' +
            '};' +
            'el.onmouseout = function(event) {' +
                'return js.HordeTip.hide(event);' +
            '};'
        );

        // Directly update the tooltip if it is already present in the DOM
        JS.injectJS(
            'if (document.getElementById(' + JSON.stringify(EXTERNAL_TOOLS_TOOLTIP_LIST_ID) + ') !== null) {' +
                'var el = document.getElementById(\'tooltipContent\');' +
                'el.innerHTML = ' + JSON.stringify('<div class="title"></div>' + new_content) + ';' +
            '}'
        );
    }

    /**
     * Reset the update state.
     */
    function reset_update()
    {
        update_state_ = {};
        set_update_in_progress(false);

        Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
            if (!module.is_enabled()) {
                return;
            }

            update_state_[module.name] = {
                module: module,
                name: I18N.get(module.name + '_name'),
                done: false,
                error: false,
                updating: false
            };
        });
    }

    /**
     * Called every time an external tool is updated.
     */
    function on_external_tool_update() {
        var number_of_tools = get_number_of_external_tools();
        var number_of_done = get_number_of_external_tool_updates_done();

        // Update the tooltip
        update_tooltip();

        // Update the hidden div
        update_hidden_div_width(number_of_done, number_of_tools);

        // if done
        if (number_of_done >= number_of_tools) {
            // reset the update status
            reset_update();

            // enable the button
            enable_button();
        }
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

        // Reset update state
        reset_update();
        
        // We are actually doing an update
        set_update_in_progress(true);

        // Disable the button
        disable_button();
        // Update the popup
        update_tooltip();
        // Update the hidden div width
        update_hidden_div_width(get_number_of_external_tool_updates_done(),
                                get_number_of_external_tools());

        JS.each(update_state_, function(module_name, state) {
            var module = state.module;
            state.updating = true;
            
            module.actions.update.call(module, function on_success() {
                state.done = true;
                state.error = false;
                state.updating = false;

                return progress_callback();

            }, function on_failure() {
                state.done = true;
                state.error = true;
                state.updating = false;

                return progress_callback();
            });
        });
    }

    /**
     * Handle the click on the update button.
     */
    function on_update_button_click()
    {
        update_external_tools(function() {
            return on_external_tool_update();
        });
    }

    /**
     * Inject the node composing the external tools bar into the DOM.
     */
    function inject_external_tools_bar_nodes()
    {
        // If the toolbar exists, abort
        if (JS.is_defined(document.getElementById(EXTERNAL_TOOLS_BAR_UPDATE_ID))) {
            return;
        }

        // Define the reference node selector
        var selector = null;
        if (D2N.is_on_page_in_city('bank')) {
            selector = 'a.button > img[src$="/gfx/icons/r_forum.gif"]';
        } else if (D2N.is_outside()) {
            selector = 'a.button > img[src$="/gfx/icons/small_hero.gif"]';
        } else {
            return;
        }

        JS.wait_for_selector(selector, function(node) {
            var reference_node = node.parentNode;

            // Create the new node
            var new_button = JS.jsonToDOM(["div", { "id": EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID },
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
            ], document);

            // Cache it
            button_container_ = new_button;
            button_hidden_div_ = new_button.childNodes[0];
            button_link_ = new_button.childNodes[1];

            // If an update is in progress, disable it
            if (is_update_in_progress()) {
                update_hidden_div_width(get_number_of_external_tool_updates_done(),
                                        get_number_of_external_tools());
                disable_button();
            }

            // Insert it
            JS.insert_after(reference_node, new_button);

            // Update the tooltip
            update_tooltip();
        }, 10);
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
                'cursor: help;' +
            '}' +

            '#' + EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID + ' div.smooth_transition {' +
                'transition: width 0.8s;' +
                '-moz-transition: width 0.8s;' +
                '-webkit-transition: width 0.8s;' +
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

    /**
     * Load the module.
     */
    function load_module()
    {
        // Reset update state (scan the available external tools and fill the
        // update state)
        reset_update();

        // Inject DOM
        document.addEventListener('d2n_gamebody_reload', function() {
            inject_external_tools_bar_nodes();
        }, false);

        // Inject CSS
        inject_external_tools_bar_style();
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

        container_id: EXTERNAL_TOOLS_BAR_UPDATE_CONTAINER_ID,

        actions: {
            can_run: function() {
                return true;
            },

            init: function(){
                add_i18n();
            },

            load: function() {
                var loaded = false;

                // inject the button if at least one external tool is enabled
                Module.iterate_on_type(Module.TYPE.EXTERNAL_TOOL, function(module) {
                    // if already loaded, abort
                    if (loaded) {
                        return;
                    }

                    // if module is enabled, then the external tools bar has to
                    // be enabled
                    if (module.is_enabled()) {
                        // Load the external tools bar module
                        load_module();

                        // Ensure it loads only once
                        loaded = true;
                    }
                });
            },

            refresh: function(){
                on_update_button_click();
            }
        }

    };
});
