Module.register(function() {

    var MODULE_NAME = 'external_tools_bar';

    /******************
     * Module context *
     ******************/

    /**
     * The external tools bar ID.
     */
    var EXTERNAL_TOOLS_BAR_UPDATE_ID = 'd2ne_external_tools_bar_update_id';

    /**
     * External tools bar DOM nodes cache.
     */
    var toolbar_link_ = null;
    var toolbar_start_ = null;
    var toolbar_loading_ = null;
    var toolbar_success_ = null;
    var toolbar_failure_ = null;

    /**
     * Remember if an external tool update is currently in progress.
     */
    var update_in_progress_ = false;

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
     * Update all the enabled external tools.
     * @param Function progress_callback Will be called on each state change
     */
    function update_external_tools(progress_callback)
    {
        // Abort if an update is already in progress
        if (update_in_progress_) {
            return;
        }

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
     * Show a start icon on the toolbar.
     */
    function show_start()
    {
        toolbar_start_.style.display = 'inline';
        toolbar_loading_.style.display = 'none';
        toolbar_success_.style.display = 'none';
        toolbar_failure_.style.display = 'none';
        toolbar_link_.classList.remove('off');
    }

    /**
     * Show a loading wheel on the toolbar.
     */
    function show_loading_wheel()
    {
        toolbar_start_.style.display = 'none';
        toolbar_loading_.style.display = 'inline';
        toolbar_success_.style.display = 'none';
        toolbar_failure_.style.display = 'none';
        toolbar_link_.classList.add('off');
    }

    /**
     * Show a success on the toolbar.
     */
    function show_success()
    {
        toolbar_start_.style.display = 'none';
        toolbar_loading_.style.display = 'none';
        toolbar_success_.style.display = 'inline';
        toolbar_failure_.style.display = 'none';
        toolbar_link_.classList.remove('off');
    }

    /**
     * Show an error on the toolbar.
     */
    function show_error()
    {
        toolbar_start_.style.display = 'none';
        toolbar_loading_.style.display = 'none';
        toolbar_success_.style.display = 'none';
        toolbar_failure_.style.display = 'inline';
        toolbar_link_.classList.remove('off');
    }

    /**
     * Handle the click on the update button.
     */
    function on_update_button_click()
    {
        update_in_progress_ = true;
        show_loading_wheel();

        update_external_tools(function on_progress() {
            var number_of_tools = 0;
            var number_of_done = 0;
            var number_of_error = 0;

            for (var key in update_state_) {
                ++number_of_tools;
                number_of_done += (update_state_[key].done === true) ? 1 : 0;
                number_of_error += (update_state_[key].error === true) ? 1 : 0;
            }

            // if done
            if (number_of_done >= number_of_tools) {
                update_in_progress_ = false;
                update_state_ = {};
                // if error
                if (number_of_error > 0) {
                    show_error();
                // if success
                } else {
                    show_success();
                }
            }
        });
    }

    /**
     * Inject the node composing the external tools bar into the DOM.
     */
    function inject_external_tools_bar_nodes()
    {
        var selector = null;

        // If the toolbar exists, reset it and abort
        if (JS.is_defined(document.getElementById(EXTERNAL_TOOLS_BAR_UPDATE_ID))) {
            show_start();
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
                ["a", { "href": "javascript:void(0)", "class": "button", "id": EXTERNAL_TOOLS_BAR_UPDATE_ID,
                    "onclick": function() { on_update_button_click(); } },
                    ["img", { "src": "/gfx/icons/r_explo2.gif", "width": "16px", "height": "16px" }],
                    ["img", { "src": "/gfx/design/loading.gif", "width": "16px", "height": "16px", "style": "display: none;" }],
                    ["img", { "src": "/gfx/icons/small_nice_lock.gif", "width": "16px", "height": "16px", "style": "display: none;" }],
                    ["img", { "src": "/gfx/icons/item_radius_mk2_part.gif", "width": "16px", "height": "16px", "style": "display: none;" }],
                    ' ' + I18N.get(MODULE_NAME + '_update_button')
                ]
            , document);

            // Cache the nodes
            toolbar_link_ = new_button;
            toolbar_start_ = new_button.childNodes[0];
            toolbar_loading_ = new_button.childNodes[1];
            toolbar_success_ = new_button.childNodes[2];
            toolbar_failure_ = new_button.childNodes[3];

            // Insert it
            JS.insert_after(reference_node, new_button);

            // Inject button again each time the gamebody is reloaded
            document.addEventListener('d2n_gamebody_reload', function() {
                inject_external_tools_bar_nodes();
            }, false);
        });
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
                inject_external_tools_bar_nodes();
            }
        }

    };
});
