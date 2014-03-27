Module.register(function() {

    var MODULE_NAME = 'configuration_panel';

    /******************
     * Module context *
     ******************/

    var D2NE_CONFIG_HASH = '#d2ne/configuration';

    /**
     * Inject in the input field to store the corresponding module name.
     */
    var INPUT_DATA_MODULE_KEY = 'data-module';

    /**
     * Inject in the input field to store the corresponding module name.
     */
    var INPUT_DATA_MODULE_PROPERTY_KEY = 'data-module-property';

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_title'] = 'D2NE - Configuration Panel';
        i18n[I18N.LANG.EN][MODULE_NAME + '_help_image_url'] = '/gfx/loc/en/helpLink.gif';
        i18n[I18N.LANG.EN][MODULE_NAME + '_general_category'] = 'General';
        i18n[I18N.LANG.EN][MODULE_NAME + '_bank_category'] = 'Bank';
        i18n[I18N.LANG.EN][MODULE_NAME + '_construction_category'] = 'Construction Sites';
        i18n[I18N.LANG.EN][MODULE_NAME + '_outside_category'] = 'Outside';
        i18n[I18N.LANG.EN][MODULE_NAME + '_external_tool_category'] = 'External Tools';
        i18n[I18N.LANG.EN][MODULE_NAME + '_soul_category'] = 'Soul page';
        i18n[I18N.LANG.EN][MODULE_NAME + '_forum_category'] = 'Forum';
        i18n[I18N.LANG.EN][MODULE_NAME + '_interface_category'] = 'Interface';
        i18n[I18N.LANG.EN][MODULE_NAME + '_various_category'] = 'Various';
        i18n[I18N.LANG.EN][MODULE_NAME + '_save_button'] = 'Save';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_title'] = 'D2NE - Panneau de configuration';
        i18n[I18N.LANG.FR][MODULE_NAME + '_help_image_url'] = '/gfx/loc/fr/helpLink.gif';
        i18n[I18N.LANG.FR][MODULE_NAME + '_general_category'] = 'Général';
        i18n[I18N.LANG.FR][MODULE_NAME + '_bank_category'] = 'Banque';
        i18n[I18N.LANG.FR][MODULE_NAME + '_construction_category'] = 'Chantiers';
        i18n[I18N.LANG.FR][MODULE_NAME + '_outside_category'] = 'Outre-Monde';
        i18n[I18N.LANG.FR][MODULE_NAME + '_external_tool_category'] = 'Outils Externes';
        i18n[I18N.LANG.FR][MODULE_NAME + '_soul_category'] = 'Page d\'âme';
        i18n[I18N.LANG.FR][MODULE_NAME + '_forum_category'] = 'Forum';
        i18n[I18N.LANG.FR][MODULE_NAME + '_interface_category'] = 'Interface';
        i18n[I18N.LANG.FR][MODULE_NAME + '_various_category'] = 'Divers';
        i18n[I18N.LANG.FR][MODULE_NAME + '_save_button'] = 'Sauvegarder';

        i18n[I18N.LANG.ES] = {};
        i18n[I18N.LANG.ES][MODULE_NAME + '_help_image_url'] = '/gfx/loc/es/helpLink.gif';

        i18n[I18N.LANG.DE] = {};
        i18n[I18N.LANG.DE][MODULE_NAME + '_help_image_url'] = '/gfx/loc/de/helpLink.gif';

        I18N.set(i18n);
    }

    /**
     * Called after a successfull save. Basically redirect the user to the
     * appropriate page.
     */
    function after_save()
    {
        var current_domain_regex = new RegExp('^http://' + window.location.host);

        // if a previous page exist and is on the same domain, go for it
        if (document.referrer && current_domain_regex.test(document.referrer)) {
            window.history.back();

        // else reload the current page
        } else {
            JS.reload();
        }
    }

    /**
     * Fetch the configuration from the configuration panel and inject it in the
     * local storage.
     */
    function save_configuration()
    {
        var configuration_panel = document.getElementById('d2ne_configuration_panel');

        for (var i = 0, max = configuration_panel.childElementCount; i < max; i += 1) {
            var el = configuration_panel.childNodes[i];

            // skip if not div
            if (el.tagName !== 'DIV') {
                continue;
            }

            // Grab input dom element
            var input_node = el.firstChild;
            var module_name = input_node.getAttribute(INPUT_DATA_MODULE_KEY);
            var module = Module.get(module_name);
            var property = input_node.getAttribute(INPUT_DATA_MODULE_PROPERTY_KEY);

            // Get the value
            var input_data;
            switch (module.configurable[property].type) {
                case Module.PROPERTY.BOOLEAN:
                    input_data = input_node.checked;
                    break;

                default:
                    input_data = null;
                    break;
            }

            // Inject it into the object and save
            module.properties[property] = input_data;
            module.save_properties();
        }
    }

    /**
     * Return the category title.
     * @return Array the title
     */
    function get_category_title(category_name)
    {
        var icon = null;
        var text = null;

        switch (category_name) {
            case Module.PROPERTY_CATEGORY.GENERAL:
                icon = '/gfx/icons/item_chair.gif';
                text = I18N.get(MODULE_NAME + '_general_category');
                break;
            case Module.PROPERTY_CATEGORY.BANK:
                icon = '/gfx/icons/item_money.gif';
                text = I18N.get(MODULE_NAME + '_bank_category');
                break;
            case Module.PROPERTY_CATEGORY.CONSTRUCTION:
                icon = '/gfx/forum/smiley/h_refine.gif';
                text = I18N.get(MODULE_NAME + '_construction_category');
                break;
            case Module.PROPERTY_CATEGORY.OUTSIDE:
                icon = '/gfx/icons/r_camp.gif';
                text = I18N.get(MODULE_NAME + '_outside_category');
                break;
            case Module.PROPERTY_CATEGORY.EXTERNAL_TOOL:
                icon = '/gfx/icons/item_radio_on.gif';
                text = I18N.get(MODULE_NAME + '_external_tool_category');
                break;
            case Module.PROPERTY_CATEGORY.SOUL:
                icon = '/gfx/icons/small_ghost_blue.gif';
                text = I18N.get(MODULE_NAME + '_soul_category');
                break;
            case Module.PROPERTY_CATEGORY.FORUM:
                icon = '/gfx/icons/r_rp.gif';
                text = I18N.get(MODULE_NAME + '_forum_category');
                break;
            case Module.PROPERTY_CATEGORY.INTERFACE:
                icon = '/gfx/icons/item_iphone.gif';
                text = I18N.get(MODULE_NAME + '_interface_category');
                break;
            default:
                icon = '/gfx/icons/item_pet_chick.gif';
                text = I18N.get(MODULE_NAME + '_various_category');
                break;
        }

        return ["h4", {},
                   ["img", { src: icon }],
                   text
               ];
    }

    /**
     * Get and sort the modules into categories.
     */
    function get_modules_json_in_categories()
    {
        var categories = {};

        Module.iterate(function(module) {

            // if configurable object does not exist, skip the module
            if (typeof module.configurable === 'undefined') {
                return;
            }

            JS.each(module.configurable, function(key, value) {
                var input_id = 'd2ne_module_' + module.name + '_' + key;
                var input_value = module.properties[key];

                var json_node =
                    ["div", {},
                        null,
                        ["label", { "for": input_id }, I18N.get(value.short_desc_I18N)],
                        ["a", { "class": "helpLink d2ne", "href": "#", "onclick": "return false;",
                                  "onmouseover": "js.HordeTip.showHelp(this, " + JSON.stringify(I18N.get(value.full_desc_I18N)) + ");",
                                  "onmouseout": "js.HordeTip.hide()" },
                            ["img", { "src": I18N.get(MODULE_NAME + '_help_image_url') }]
                        ]
                    ];

                var node = ["/* node_html_type */", { /* node attributes */ }];
                switch (value.type) {
                    case Module.PROPERTY.BOOLEAN:
                        node[0] = "input";
                        node[1].type = "checkbox";

                        if (input_value === true) {
                            node[1].checked = ''; // declare a checked attribute
                        }
                        break;

                    default:
                        return;
                }

                node[1].id = input_id;
                node[1][INPUT_DATA_MODULE_KEY] = module.name;
                node[1][INPUT_DATA_MODULE_PROPERTY_KEY] = key;

                json_node[2] = node;

                // Store the node
                var c = null;
                if (typeof value.category === 'undefined') {
                    c = Module.PROPERTY_CATEGORY.UNKNOWN_CATEGORY;
                } else {
                    c = value.category;
                }

                categories[c] = categories[c] || [];
                categories[c].push(json_node);
            });
        });

        return categories;
    }

    function insert_configuration_panel_dom()
    {
        var configuration_panel_json = ["div", { id: "d2ne_configuration_panel" }];

        configuration_panel_json.push(['h1', {}, I18N.get(MODULE_NAME + '_title')]);

        // Iterate over each module in each category
        var categories = get_modules_json_in_categories();
        Module.PROPERTY_CATEGORY_PRIORITY_ORDER.forEach(function(category_name) {
            var category_id = Module.PROPERTY_CATEGORY[category_name];
            var category = categories[category_id];

            if (!JS.is_defined(category)) {
                return;
            }

            configuration_panel_json.push(get_category_title(category_id));

            category.forEach(function(json_node) {
                configuration_panel_json.push(json_node);
            });
        });

        configuration_panel_json.push(
            ["a", { href: "javascript:void(0)", class: "button", onclick: function() { save_configuration(); after_save(); } },
                I18N.get(MODULE_NAME + '_save_button')
            ]
        );

        JS.wait_for_id('gameBodyLight', function(node) {
            JS.delete_all_children(node);
            node.appendChild(JS.jsonToDOM(configuration_panel_json, document));
        });
    }

    function insert_configuration_panel_style()
    {
        JS.injectCSS(
            '#d2ne_configuration_panel {' +
                'border: 1px solid #b37c4a;' +
                'width: 500px;' +
                'margin: 0 auto;' +
                'padding: 15px;' +
                'background: #5C3110;' +
            '}' +

            '#d2ne_configuration_panel h1 {' +
                'padding-left: 0;' +
                'margin: 0 auto;' +
                'text-align: center;' +
                'background: none;' +
                'height: initial;' +
            '}' +

            '#d2ne_configuration_panel h4 {' +
                'text-align: left;' +
                'padding-top: 4px;' +
                'padding-bottom: 3px;' +
                'width: 100%;' +
                'margin: 0 auto;' +
                'margin-top: 25px;' +
                'margin-bottom: 10px;' +
                'border: 1px dotted rgba(179, 124, 74, 0.5);' +
                'background-color: rgb(112, 62, 33);' +
            '}' +

            '#d2ne_configuration_panel div {' +
                'margin-bottom: 1px;' +
            '}' +

            '#d2ne_configuration_panel h4 img {' +
                'margin-right: 5px;' +
                'vertical-align: -20%;' +
            '}' +

            '#d2ne_configuration_panel a.helpLink {' +
                'float: right;' +
            '}' +

            '#d2ne_configuration_panel a.button {' +
                'margin: 0 auto;' +
                'margin-top: 20px;' +
                'text-align: center;' +
            '}'
        );
    }

    function change_page_title()
    {
        var old_title = document.title;
        var split_title = old_title.split(':');
        var new_title = split_title[0] + ': ' + I18N.get(MODULE_NAME + '_title');

        document.title = new_title;
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

            init: function() {
                add_i18n();
            },

            load: function() {
                insert_configuration_panel_style();

                // Wait until all the modules are loaded
                document.addEventListener('d2ne_all_modules_loaded', function() {
                    // If already on the good page, load the configuration panel
                    if (window.location.hash === D2NE_CONFIG_HASH) {
                        change_page_title();
                        insert_configuration_panel_dom();
                    }

                    // If loading the configuration panel URL, load it too
                    window.addEventListener('hashchange', function() {
                        var listener = function() {
                            document.removeEventListener('d2n_gamebody_reload', listener, false);
                            if (window.location.hash === D2NE_CONFIG_HASH) {
                                change_page_title();
                                insert_configuration_panel_dom();
                            }
                        };
                        document.addEventListener('d2n_gamebody_reload', listener, false);
                    }, false);
                });
            }
        }

    };
});
