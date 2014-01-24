Module.add((function() {

    /******************
     * Module context *
     ******************/

    var i18n = {};

    i18n['configuration_panel_title'] = {};
    i18n['configuration_panel_title'][I18N.LANG.EN] = 'Die2Nite Enhancer - Settings';
    i18n['configuration_panel_title'][I18N.LANG.FR] = 'Die2Nite Enhancer - Paramètres';

    i18n['configuration_panel_script_description'] = {};
    i18n['configuration_panel_script_description'][I18N.LANG.EN] = 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.';
    i18n['configuration_panel_script_description'][I18N.LANG.FR] = 'Die2Nite Enhancer vous permet d\'améliorer votre expérience de jeu, toutes les fonctionalités peuvent être controlées depuis ce panneau de configuration.';

    i18n['configuration_panel_save_button'] = {};
    i18n['configuration_panel_save_button'][I18N.LANG.EN] = 'Save';
    i18n['configuration_panel_save_button'][I18N.LANG.FR] = 'Sauvegarder';

    I18N.set(i18n);


    /************************
     * Module configuration *
     ************************/

    return {

        name: 'configuration_panel',
        type: Module.TYPE.CONTAINER,

        config: {
            enabled: false
        },

        action: {
            load: function() {
                JS.wait_for_id('main', function(node) {
                    // Create and inject panel style
                    JS.injectCSS(

                        '#d2ne_configuration_panel {' +
                            'z-index: 9;' +
                            'position: absolute;' +
                            'margin-top: 5px;' +
                            'margin-left: 44px;' +
                            'background-color: #5c2b20;' +
                            'border: 1px solid #000000;' +
                            'max-width: 430px;' +
                        '}' +

                        '#d2ne_configuration_panel h1 {' +
                            'height: auto;' +
                            'font-size: 8pt;' +
                            'text-transform: none;' +
                            'font-variant: small-caps;' +
                            'background: none;' +
                            'cursor: help;' +
                            'margin: 0;' +
                            'padding: 0;' +
                        '}' +
                        '#d2ne_configuration_panel:hover h1 {' +
                            'border-bottom: 1px solid #b37c4a;' +
                            'margin-bottom: 5px;' +
                        '}' +

                        '#d2ne_configuration_panel > div {' +
                            'line-height: 23px;' +
                            'border: 1px solid #f0d79e;' +
                            'padding-left: 5px;' +
                            'padding-right: 5px;' +
                        '}' +

                        '#d2ne_configuration_panel p {' +
                            'padding-bottom: 7px;' +
                            'margin-bottom: 3px;' +
                            'font-size: 9pt;' +
                            'line-height: 11pt;' +
                            'text-align: justify;' +
                            'border-bottom: 1px dashed #ddab76;' +
                        '}' +

                        '#d2ne_configuration_panel div > div > h4 {' +
                            'text-align: left;' +
                            'border-bottom: 1px dotted rgba(221, 171, 118, 0.8);' +
                            'padding-bottom: 4px;' +
                            'margin-bottom: 5px;' +
                            'margin-top: 4px;' +
                        '}' +
                        '#d2ne_configuration_panel div > div > h4 > img {' +
                            'vertical-align: -11%;' +
                            'margin-right: 5px;' +
                        '}' +

                        '#d2ne_configuration_panel div > div {' +
                            'position: relative;' +
                        '}' +
                        '#d2ne_configuration_panel div > div > div img {' +
                            'position: absolute;' +
                            'top: 0;' +
                            'bottom: 0;' +
                            'right: 0;' +
                            'margin: auto;' +
                            'margin-right: 4px;' +
                        '}' +

                        'a.d2ne_tooltip {' +
                            'display: inline;' +
                            'cursor: help' +
                        '}' +
                        'a.d2ne_tooltip img {' +
                            'border: 1px solid #5c2b20;' +
                        '}' +
                        'a.d2ne_tooltip img:hover {' +
                            'border: 1px solid #ffffff;' +
                        '}' +
                        'a.d2ne_tooltip:hover:after {' +
                            'line-height: normal;' +
                            'z-index: 98;' +
                            'position: absolute;' +
                            'top: 4px;' +
                            'right: -305px;' +
                            'content: attr(tooltip);' +
                            'font-family: Verdana;' +
                            'font-size: 12px;' +
                            'color: #ffffff;' +
                            'border: 1px solid #ecb98a;' +
                            'background-color: #5c2b20;' +
                            'background-image: url("/gfx/design/iconHelp.gif");' +
                            'background-position: 5px 0px;' +
                            'background-repeat: no-repeat;' +
                            'width: 250px;' +
                            'padding: 4px 10px 9px 30px;' +
                        '}' +

                        '#d2ne_configuration_panel > div > div > div:last-child {' +
                            'text-align: right;' +
                        '}' +

                        '#d2ne_configuration_panel a.button {' +
                            'width: auto;' +
                            'text-align: center;' +
                            'padding: 0;' +
                            'padding-top: 2px;' +
                            'height: 19px;' +
                            'margin: 0;' +
                            'margin-top: 5px;' +
                        '}'
                    );

                    var config_panel_div = JS.jsonToDOM(
                        ["div", { "id": "d2ne_configuration_panel" },
                            ["div", {},
                                ["h1", {},
                                    ["img", { "src": "/gfx/forum/smiley/h_city_up.gif", "alt": "" }],
                                    ["span", { "style": "display: none;" }, ' ' + I18N.get('configuration_panel_title')]
                                ],

                                ["div", { "style": "display: none;" },
                                    ["p", {}, I18N.get('configuration_panel_script_description')],

                                    ["p", {},
                                        ["a", { "href": "javascript:void(0)", "class": "button",
                                                "onclick": function() { save_configuration(); JS.reload(); } },
                                            I18N.get('configuration_panel_save_button')]
                                    ],

                                    ["div", {},
                                        ["a", { "href": "__PROJECT_WEBSITE__", "target": "_blank" }, "__NAME__ v__VERSION__"]
                                    ]
                                ]
                            ]
                        ]
                    , document);

                    // Insert panel
                    node.insertBefore(config_panel_div, node.firstChild);

                    // Inject configuration in the config panel (in the DOM)
                    //inject_configuration();

                    // Show/Hide config panel cache
                    var config_panel_toggled_elements_cache = document.querySelectorAll('#d2ne_configuration_panel > div > h1 > span, #d2ne_configuration_panel > div > div');
                    var config_panel_toggled_elements_cache_length = config_panel_toggled_elements_cache.length;

                    // Show panel on hover
                    config_panel_div.addEventListener('mouseover', function() {
                        config_panel_div.style['z-index'] = '11'; // This fix is needed for the spanish version, as the hero adds has a z-index of 10
                        for (var i = 0; i < config_panel_toggled_elements_cache_length; ++i) {
                            config_panel_toggled_elements_cache[i].style.display = 'inline';
                        }
                    }, false);

                    // Hide panel on mouse out
                    config_panel_div.addEventListener('mouseout', function() {
                        for (var i = 0; i < config_panel_toggled_elements_cache_length; ++i) {
                            config_panel_toggled_elements_cache[i].style.display = 'none';
                        }
                        config_panel_div.style['z-index'] = '9'; // See previous function comment
                    }, false);
                });
            }
        }

    };
})());
