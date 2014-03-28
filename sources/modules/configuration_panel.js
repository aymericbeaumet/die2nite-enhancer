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
        i18n[I18N.LANG.EN][MODULE_NAME + '_title'] = 'Die2Nite Enhancer - Configuration Panel';
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
        i18n[I18N.LANG.EN][MODULE_NAME + '_close_button'] = 'Close';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_title'] = 'Die2Nite Enhancer - Panneau de configuration';
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
        i18n[I18N.LANG.EN][MODULE_NAME + '_close_button'] = 'Fermer';

        i18n[I18N.LANG.ES] = {};
        i18n[I18N.LANG.ES][MODULE_NAME + '_help_image_url'] = '/gfx/loc/es/helpLink.gif';

        i18n[I18N.LANG.DE] = {};
        i18n[I18N.LANG.DE][MODULE_NAME + '_help_image_url'] = '/gfx/loc/de/helpLink.gif';

        I18N.set(i18n);
    }

    /**
     * Fetch the configuration from the configuration panel and inject it in the
     * local storage.
     */
    function save_configuration()
    {
        var configuration_panel = document.querySelector('#d2ne_configuration_panel > div:nth-child(2)');

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

        return ["h2", {},
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
        var el;
        if ((el = document.getElementById('d2ne_configuration_panel'))) {
            el.style.display = 'block';
            D2N.show_empty_notification();
            return;
        }

        var configuration_panel_json = ["div", {}];

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

        configuration_panel_json.push(["table", {},
            ["tr", {},
                ["td", {},
                    ["a", { href: "javascript:void(0)", class: "button", onclick: function() {
                                                                                      scroll(0, 0);
                                                                                      D2N.hide_empty_notification();
                                                                                      document.getElementById('d2ne_configuration_panel').style.display = 'none'; }
                                                                                  },
                        I18N.get(MODULE_NAME + '_close_button')
                    ]
                ],
                ["td", {},
                    ["a", { href: "javascript:void(0)", class: "button", onclick: function() { save_configuration(); scroll(0, 0); JS.reload(); } },
                        I18N.get(MODULE_NAME + '_save_button')
                    ]
                ]
            ]
        ]);

        JS.wait_for_class('bigBg2', function(node) {
            node[0].appendChild(JS.jsonToDOM(["div", { id: 'd2ne_configuration_panel' },
                ["div"],
                configuration_panel_json,
                ["div"]
            ], document));
            D2N.show_empty_notification();
        });
    }

    function insert_configuration_panel_style()
    {
        JS.injectCSS(
            // Mandatory to still see the tooltips above the configuration panel
            '#tooltip {' +
                'z-index: 242 !important;' +
            '}' +

            '#d2ne_configuration_panel {' +
                'width: 598px;' +
                'position: absolute;' +
                'z-index: 142;' +
                'left: 0;' +
                'right: 0;' +
                'top: 70px;' +
                'margin: 0 auto;' +
                'margin-bottom: 70px;' +
            '}' +

            '#d2ne_configuration_panel > div:nth-child(1) {' +
                'background-image: url("/gfx/design/panel_header.gif");' +
                'height: 18px;' +
                '-webkit-border-top-left-radius: 48px;' +
                '-moz-border-top-left-radius: 48px;' +
                'border-top-left-radius: 48px;' +
                '-webkit-border-top-right-radius: 48px 30px;' +
                '-moz-border-top-right-radius: 48px 30px;' +
                'border-top-right-radius: 48px 30px;' +
                'border: none;' +
            '}' +

            '#d2ne_configuration_panel > div:nth-child(3) {' +
                'background-image: url("/gfx/design/panel_footer.gif");' +
                'height: 16px;' +
                '-webkit-border-bottom-left-radius: 48px;' +
                '-moz-border-bottom-left-radius: 48px;' +
                'border-bottom-left-radius: 48px;' +
                '-webkit-border-bottom-right-radius: 48px 30px;' +
                '-moz-border-bottom-right-radius: 48px 30px;' +
                'border-bottom-right-radius: 48px 30px;' +
                'border: none;' +
            '}' +

            '#d2ne_configuration_panel > div:nth-child(2) {' +
                'padding: 0px 25px;' +
                'padding-left: 27px;' +
                'background: url("/gfx/design/panel_bg.gif");' +
            '}' +

            '#d2ne_configuration_panel h1 {' +
                'margin: 0 auto;' +
                'height: initial;' +
                'padding-bottom: 15px;' +
                'padding-left: 51px;' +
            '}' +

            '#d2ne_configuration_panel h2 {' +
                'padding-bottom: 3px;' +
                'width: 100%;' +
                'border: 1px dotted rgba(179, 124, 74, 0.5);' +
                'border-bottom: 1px solid rgba(179, 124, 74, 0.6);' +
                'border-right: 1px solid rgba(179, 124, 74, 0.6);' +
                'background-color: rgb(112, 62, 33);' +
            '}' +

            '#d2ne_configuration_panel h2 img {' +
                'margin-left: 5px;' +
                'margin-right: 5px;' +
                'vertical-align: -20%;' +
            '}' +

            '#d2ne_configuration_panel div div {' +
                'margin-bottom: 1px;' +
            '}' +

            '#d2ne_configuration_panel a.helpLink {' +
                'float: right;' +
            '}' +

            '#d2ne_configuration_panel table {' +
                'margin: 0 auto;' +
            '}' +

            '#d2ne_configuration_panel a.button {' +
                'margin: 0 auto;' +
                'margin-top: 14px;' +
                'text-align: center;' +
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

            init: function() {
                add_i18n();
            },

            load: function() {
                insert_configuration_panel_style();

                document.addEventListener('d2ne_load_configuration_panel', function() {
                    insert_configuration_panel_dom();
                }, false);

                document.addEventListener('d2ne_hide_configuration_panel', function() {
                    var el = document.getElementById('d2ne_configuration_panel');
                    el.style.display = 'none';
                }, false);
            }
        }

    };
});
