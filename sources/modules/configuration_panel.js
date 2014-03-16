Module.register(function() {

    var MODULE_NAME = 'configuration_panel';

    /******************
     * Module context *
     ******************/

    /**
     * Inject in the input field to store the corresponding module name.
     */
    var INPUT_DATA_MODULE_KEY = 'data-module';

    /**
     * Inject in the input field to store the corresponding module name.
     */
    var INPUT_DATA_MODULE_PROPERTY_KEY = 'data-module-property';

    /**
     * The node where the module configuration div have to be inserted. This
     * variable is filled during the loading.
     */
    var configuration_panel_extensible_zone_node_ = null;

    /**
     * Add the i18n strings for this module.
     */
    function add_i18n()
    {
        var i18n = {};

        i18n[I18N.LANG.EN] = {};
        i18n[I18N.LANG.EN][MODULE_NAME + '_title'] = 'Die2Nite Enhancer - Settings';
        i18n[I18N.LANG.EN][MODULE_NAME + '_description'] = 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.';
        i18n[I18N.LANG.EN][MODULE_NAME + '_help_image_url'] = '/gfx/loc/en/helpLink.gif';
        i18n[I18N.LANG.EN][MODULE_NAME + '_citizen_category'] = 'Citizen';
        i18n[I18N.LANG.EN][MODULE_NAME + '_hero_category'] = 'Hero';
        i18n[I18N.LANG.EN][MODULE_NAME + '_external_tool_category'] = 'External Tools';
        i18n[I18N.LANG.EN][MODULE_NAME + '_forum_category'] = 'Forum';
        i18n[I18N.LANG.EN][MODULE_NAME + '_interface_category'] = 'Interface';
        i18n[I18N.LANG.EN][MODULE_NAME + '_various_category'] = 'Various';
        i18n[I18N.LANG.EN][MODULE_NAME + '_save_button'] = 'Save';

        i18n[I18N.LANG.FR] = {};
        i18n[I18N.LANG.FR][MODULE_NAME + '_title'] = 'Die2Nite Enhancer - Paramètres';
        i18n[I18N.LANG.FR][MODULE_NAME + '_description'] = 'Die2Nite Enhancer vous permet d\'améliorer votre expérience de jeu, toutes les fonctionnalités peuvent être controlées depuis ce panneau de configuration.';
        i18n[I18N.LANG.FR][MODULE_NAME + '_help_image_url'] = '/gfx/loc/fr/helpLink.gif';
        i18n[I18N.LANG.FR][MODULE_NAME + '_citizen_category'] = 'Citoyen';
        i18n[I18N.LANG.FR][MODULE_NAME + '_hero_category'] = 'Héros';
        i18n[I18N.LANG.FR][MODULE_NAME + '_external_tool_category'] = 'Outils Externes';
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
     * Return the category title.
     * @return Array the title
     */
    function get_category_title(category_name)
    {
        var icon = null;
        var text = null;

        switch (category_name) {
            case Module.PROPERTY_CATEGORY.CITIZEN:
                icon = '/gfx/forum/smiley/h_basic.gif';
                text = I18N.get(MODULE_NAME + '_citizen_category');
                break;
            case Module.PROPERTY_CATEGORY.HERO:
                icon = '/gfx/icons/small_hero.gif';
                text = I18N.get(MODULE_NAME + '_hero_category');
                break;
            case Module.PROPERTY_CATEGORY.EXTERNAL_TOOL:
                icon = '/gfx/icons/item_radio_on.gif';
                text = I18N.get(MODULE_NAME + '_external_tool_category');
                break;
            case Module.PROPERTY_CATEGORY.FORUM:
                icon = '/gfx/icons/r_rp.gif';
                text = I18N.get(MODULE_NAME + '_forum_category');
                break;
            case Module.PROPERTY_CATEGORY.INTERFACE:
                icon = '/gfx/forum/smiley/h_refine.gif';
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
     * Load the modules in the configuration panel.
     */
    function load_modules_in_configuration_panel()
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

        // Iterate over categories and insert
        Module.PROPERTY_CATEGORY_PRIORITY_ORDER.forEach(function(category_name) {
            var category_id = Module.PROPERTY_CATEGORY[category_name];
            var category = categories[category_id];

            if (!JS.is_defined(category)) {
                return;
            }

            configuration_panel_extensible_zone_node_.appendChild(JS.jsonToDOM(get_category_title(category_id), document));

            category.forEach(function(json_node) {
                configuration_panel_extensible_zone_node_.appendChild(JS.jsonToDOM(json_node, document));
            });
        });
    }

    /**
     * Listen for the event dispatched when all the modules are loaded.
     */
    function add_callback_when_all_modules_loaded()
    {
        // Set a callback when all the modules are loaded
        document.addEventListener('d2ne_all_modules_loaded', function() {
            load_modules_in_configuration_panel();
        });
    }

    /**
     * Fetch the configuration from the configuration panel and inject it in the
     * local storage.
     */
    function save_configuration()
    {
        var input_node = null;
        var module = null;
        var module_name = null;
        var property = null;
        var input_data = null;

        for (var i = 0, max = configuration_panel_extensible_zone_node_.childElementCount; i < max; i += 1) {
            // skip if not div
            if (configuration_panel_extensible_zone_node_.childNodes[i].tagName.toLowerCase() !== 'div') {
                continue;
            }

            input_node = configuration_panel_extensible_zone_node_.childNodes[i].firstChild;
            module_name = input_node.getAttribute(INPUT_DATA_MODULE_KEY);
            module = Module.get(module_name);
            property = input_node.getAttribute(INPUT_DATA_MODULE_PROPERTY_KEY);

            // Get the value
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
     * Inject the configuration panel CSS.
     */
    function inject_configuration_panel_css()
    {
        JS.injectCSS(

            '#sites {' +
                'z-index: 14;' +
            '}' +

            '#d2ne_configuration_panel {' +
                'z-index: 13;' +
                'position: absolute;' +
                'margin-top: 5px;' +
                'margin-left: 44px;' +
                'background-color: #5c2b20;' +
                'border: 1px solid #000000;' +
                'max-width: 885px;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > h1 {' +
                'height: auto;' +
                'font-size: 8pt;' +
                'text-transform: none;' +
                'font-variant: small-caps;' +
                'background: none;' +
                'cursor: help;' +
                'margin: 0;' +
                'padding: 0;' +
            '}' +
            '#d2ne_configuration_panel:hover > div.wrapper > h1 {' +
                'border-bottom: 1px solid #b37c4a;' +
                'margin-bottom: 5px;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > h1 > span {' +
                'display: none;' +
            '}' +
            '#d2ne_configuration_panel:hover > div.wrapper > h1 > span {' +
                'display: inline;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper {' +
                'line-height: 23px;' +
                'border: 1px solid #f0d79e;' +
                'padding-left: 5px;' +
                'padding-right: 5px;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > div {' +
                'display: none;' +
            '}' +
            '#d2ne_configuration_panel:hover > div.wrapper > div {' +
                'display: block;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > div > p {' +
                'padding-bottom: 7px;' +
                'margin-bottom: 3px;' +
                'font-size: 9pt;' +
                'line-height: 11pt;' +
                'text-align: justify;' +
                'border-bottom: 1px dashed #ddab76;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > div > div.extensible {' +
                '-moz-column-count: 2;' +
                '-webkit-column-count: 2;' +
                'column-count: 2;' +
                'margin-top: 10px;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > div > div.extensible > h4:first-child {' +
                'margin-top: 0;' +
            '}' +
            '#d2ne_configuration_panel > div.wrapper > div > div.extensible > h4 {' +
                'text-align: left;' +
                'border-bottom: 1px dotted rgba(221, 171, 118, 0.8);' +
                'padding-bottom: 4px;' +
                'margin-bottom: 4px;' +
                'margin-top: 7px;' +
                'width: 430px;' +
            '}' +
            '#d2ne_configuration_panel > div.wrapper > div > div.extensible > h4 > img {' +
                'vertical-align: -11%;' +
                'margin-right: 5px;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > div > div.extensible > div {' +
                'position: relative;' +
                'line-height: 22px;' +
                'width: 430px;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > div > div.extensible > div > a.helpLink {' +
                'position: absolute;' +
                'top: 0;' +
                'right: 0;' +
            '}' +

            '#tooltip {' +
                'z-index: 15 !important;' +
                'pointer-events: none;' +
            '}' +

            '#d2ne_configuration_panel input[type="checkbox"] {' +
                'margin: 0;' +
                'margin-left: 2px;' +
                'margin-right: 4px;' +
            '}' +

            '#d2ne_configuration_panel > div.wrapper > div > div:last-child {' +
                'text-align: right;' +
            '}' +

            '#d2ne_configuration_panel a.button {' +
                'width: auto;' +
                'text-align: center;' +
                'padding: 0;' +
                'padding-top: 2px;' +
                'height: 19px;' +
                'margin: 0;' +
                'margin-top: 8px;' +
            '}'
        );
    }

    function insert_configuration_panel_dom()
    {
        JS.wait_for_id('contentBg', function(node) {
            var config_panel_div = JS.jsonToDOM(["div", { "id": "d2ne_configuration_panel" },
                ["div", { "class": "wrapper" },
                    ["h1", {},
                        ["img", { "src": "/gfx/forum/smiley/h_city_up.gif", "alt": "" }],
                        ["span", {}, ' ' + I18N.get(MODULE_NAME + '_title')]
                    ],

                    ["div", {},
                        ["p", {}, I18N.get(MODULE_NAME + '_description')],

                        ["div", { "class": "extensible" }],

                        ["p", {},
                            ["a", { "href": "javascript:void(0)", "class": "button",
                                    "onclick": function() { save_configuration(); JS.reload(); } },
                                I18N.get(MODULE_NAME + '_save_button')]
                        ],

                        ["div", {},
                            ["a", { "href": "<%= homepage %>", "target": "_blank" }, "<%= full_name %> v<%= version %>"]
                        ]
                    ]
                ]
            ], document);

            configuration_panel_extensible_zone_node_ = config_panel_div.childNodes[0].childNodes[1].childNodes[1];

            // Insert panel
            node.insertBefore(config_panel_div, node.firstChild);
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

            init: function() {
                add_callback_when_all_modules_loaded();
                add_i18n();
            },

            load: function() {
                inject_configuration_panel_css();
                insert_configuration_panel_dom();
            }
        }

    };
});
