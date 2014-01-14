/**
 * Die2Nite Enhancer
 */

var D2NE = (function() {

/*
  public:
*/

    /**
     * Set up the script.
     */
    function init()
    {
        load_configuration();
        load_internationalisation();
        load_features();
        load_external_tools(); // only if at least one tool is enabled
        load_configuration_panel(); // defer loading until #main is found
        fetch_tools_private_keys();
        D2N_helpers.add_custom_events(); // add and fire custom events after initialisation
    };

/*
  private:
*/

    var LOCAL_STORAGE_PREFIX = 'extensions.d2ne';
    var LOCAL_STORAGE_D2NE_CONFIGURATION_KEY = LOCAL_STORAGE_PREFIX + '.configuration';

    /**
     * The default configuration.
     */
    var default_configuration_ = {
        // Set to true to enable binds
        enable_shortcuts: false,
        // The global bind (e.g.: to go to the bank `gb`)
        go_bind: 71, // 'G'
        // Page specific bind (have to be preceded by "go_bind")
        binds: {
            overview: 79, // 'O'
            home: 72, // 'H'
            well: 87, // 'W'
            bank: 66, // 'B'
            citizens: 67, // 'C'
            buildings: 68, // 'D'
            doors: 71, // 'G'
            upgrades: 80, // 'P'
            tower: 84, // 'T'
            refine: 77, // 'M'
            guard: 76 // 'L'
        },

        // Set to true to hide hero adds
        hide_hero_adds: true,

        // Set to true to enable AP color border
        highlight_ap: true,

        // Set to true to hide the help
        hide_help: true,

        // Set to true to hide the Twinoid bar
        hide_twinoid_bar: false,

        // Set to true to hide the footer
        hide_footer: true,

        // Set to true to hide the PEGI image at the bottom of each page
        hide_pegi: true,

        // Set to true to hide the rookie mode links
        hide_rookie_mode: true,

        // Set to true to hide the RP
        hide_rp_content: true,

        // Sync with external tools
        external_tools: {
            // Set to true to enable BigBroth'Hordes (http://bbh.fred26.fr/)
            enable_bbh_sync: false,
            // Set to true to enable Où en êtes-vous ? (http://www.oeev-hordes.com/)
            enable_oeev_sync: false
        },

        // Set to true to enable the use of maximum AP in the constructions
        enable_construction_max_ap: true,

        // Set to true to hide all the completed constructions
        hide_completed_constructions: false,

        // Set to true to enable the stat on hero bar
        enable_hero_bar_stat: true
    };

    /**
     * The loaded configuration.
     */
    var configuration_ = null;

    /**
     * The script strings.
     */
    var i18n_ = null;

    /**
     * External tools
     */
    var external_tools_ = {
        oeev: {
            site_id: 22,
            local_storage_key: LOCAL_STORAGE_PREFIX + '.oeev_key',
            configuration_panel_id: 'd2ne_configuration_enable_oeev_sync',
            update: function(callback_success, callback_failure) {
                js.network_request(
                    'POST',
                    'http://www.oeev-hordes.com/',
                    'key=' + localStorage[external_tools_.oeev.local_storage_key] + '&mode=json',
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        if (response_text !== '{ "response": "Site mis à jour" }') {
                            return callback_failure();
                        }
                        return callback_success();
                    },
                    function() {
                        return callback_failure();
                    }
                );
            }
        },

        bbh: {
            site_id: 51,
            local_storage_key: LOCAL_STORAGE_PREFIX + '.bbh_key',
            configuration_panel_id: 'd2ne_configuration_enable_bbh_sync',
            update: function(callback_success, callback_failure) {
                js.network_request(
                    'POST',
                    'http://bbh.fred26.fr/',
                    'key=' + localStorage[external_tools_.bbh.local_storage_key] + '&action=force_maj',
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        // if response is too short, it is incomplete because
                        // the user is not logged
                        if (response_text.length < 20000) {
                            return callback_failure();
                        }
                        return callback_success();
                    },
                    function() {
                        return callback_failure();
                    }
                );
            }
        }
    };

    /**
     * All features available in this extension
     */
    var features_ = {

        ////
        hide_twinoid_bar: function() {
            js.injectCSS(
                '#tid_bar {' +
                    'display: none;' +
                    'position: fixed;' +
                    'z-index: 15;' +
                '}' +
                '#gamebody div.infoBar {' +
                    'top: 111px;' +
                '}' +
                'a#backReboot {' +
                    'top: 178px;' +
                '}'
            );

            js.wait_for_id('tid_bar', function(node) {
                var tid_cache = node;
                var tid_hidden = true;
                js.wait_for_selector_all('.tid_sidePanel', function(nodes) {
                    var show_tid = function() {
                        tid_cache.style.display = 'block';
                        tid_hidden = false;
                    };

                    var hide_tid = function() {
                        tid_cache.style.display = 'none';
                        tid_hidden = true;
                    };

                    document.body.addEventListener('mousemove', function(event) {
                        // if on the top of the screen, display the bar
                        if (tid_hidden && event.clientY <= 5) {
                            show_tid();
                        }
                        // if not on the top of the screen, hide the bar if the
                        // lateral panels are not visible
                        else if (!tid_hidden && event.clientY > 32) {
                            var tid_side_panels = document.getElementsByClassName('tid_sidePanel');
                            var tid_side_panels_length = tid_side_panels.length;

                            for (var i = 0; i < tid_side_panels_length; ++i) {
                                var style = getComputedStyle(tid_side_panels[i]);

                                if (style['visibility'] === 'visible') {
                                    return;
                                }
                            }
                            hide_tid();
                        }
                    }, false);
                });
            });
        },

        ////
        enable_shortcuts: function() {
            js.keydown_event(function(keycode, previous_keycode) {
                if (previous_keycode !== configuration_.go_bind) {
                    return;
                }

                for (var bind in configuration_.binds) {
                    if (configuration_.binds[bind] === keycode) {
                        return D2N_helpers.go_to_city_page(bind);
                    }
                }
            });
        },

        ////
        hide_hero_adds: function() {
            js.injectCSS(
                '.heroMode, #ghostHeroAd, #heroContainer, .heroAd, #ghostHeroChoose, .promoBt, .sondageBg {' +
                    'display: none !important;' +
                '}'
            );
        },

        ////
        highlight_ap: function() {
            js.wait_for_id('movesCounter', function(node) {
                var highlight = function() {
                    D2N_helpers.get_number_of_ap(function(ap) {
                        var colors = [
                            'ff0000', // 0 AP
                            'ff4700', // 1 AP
                            'ff8e00', // 2 AP
                            'ffd500', // 3 AP
                            'e3ff00', // 4 AP
                            '9cff00', // 5 AP
                            '55ff00', // 6 AP
                            '00ff00'  // 7 AP+
                        ];

                        while (ap >= colors.length) {
                            --ap;
                        }

                        js.injectCSS(
                            '#movesCounter {' +
                                'border: 1px solid #' + colors[ap] + ' !important;' +
                            '}'
                        );
                    });
                };

                // Highlight at load
                highlight();

                // Highlight on change
                document.addEventListener('d2n_apchange', function() {
                    highlight();
                }, false);
            });
        },

        ////
        hide_help: function() {
            js.injectCSS(
                '#mapTips, a.button[href^="#city/exp?editor=1;sk="] + p, .helpLink, #generic_section > div > em:last-of-type {' +
                    'display: none;' +
                '}' +

                // Hide all blue help boxes, but keep the watchwen button
                '#generic_section {' +
                    'position: relative;' +
                    'top: 0;' +
                    'left: 0;' +
                '}' +
                '.help {' +
                    'position: absolute;' +
                    'top: 0;' +
                    'left: -1500px;' +
                    'width: 0;' +
                '}' +
                '.help a.button {' +
                    'position: absolute;' +
                    'top: 131px;' +
                    'left: 1499px;' +
                '}' +
                'ul#door_menu + script + div.help + table {' +
                    'margin-top: 60px;' +
                '}'
            );
        },

        ////
        hide_footer: function() {
            js.injectCSS(
                '#tid_bar_down {' +
                    'display: none;' +
                '}' +
                '#fbAd {' +
                    'height: 0;' +
                    'overflow: hidden;' +
                '}'
            );
        },

        ////
        hide_pegi: function() {
            js.injectCSS(
                '.pegi {' +
                    'display: none;' +
                '}'
            );
        },

        ////
        hide_rookie_mode: function() {
            js.injectCSS(
                'div.block.tutorialBlock, div.expertMode {' +
                    'display: none;' +
                '}'
            );
        },

        ////
        hide_rp_content: function() {
            js.injectCSS(
                '.ambiant, .flavor {' +
                    'display: none;' +
                '}'
            );
        },

        ////
        enable_construction_max_ap: function() {
            var change_ap = function() {
                if (!D2N_helpers.is_on_page_in_city('buildings')) {
                    return;
                }

                D2N_helpers.get_number_of_ap(function(ap) {
                    js.wait_for_selector('tr.banner.root_wall1', function() {
                        var fields = document.querySelectorAll('div[id^="moreForm_"] form input[type="text"]');
                        var fields_length = fields.length;

                        for (var i = 0; i < fields_length; ++i) {
                            fields[i].value = ap;
                        }
                    });
                });
            };

            document.addEventListener('d2n_apchange', function() {
                change_ap();
            }, false);

            document.addEventListener('d2n_hashchange', function() {
                change_ap();
            }, false);
        },

        ////
        hide_completed_constructions: function() {
            js.injectCSS(
                'tr.building.done {' +
                    'display: none;' +
                '}'
            );
        },

        ////
        enable_hero_bar_stat: function() {
            js.injectCSS(
                'div.heroUpBar div.hfront {' +
                'padding-left: 6px;' +
                'text-align: center;' +
                'font-family: "Century Gothic", "Arial", "Trebuchet MS", Verdana, sans-serif;' +
                'font-size: 16pt;' +
                'padding-top: 10px;' +
                'color: #f0d79e;' +
                'text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;' +
                '}'
            );

            document.addEventListener('d2n_hashchange', function() {
                if (!(D2N_helpers.is_on_page('ghost') || D2N_helpers.is_on_page('ghost_exp'))) {
                    return;
                }

                js.wait_for_selector('#ghostImg img', function(node) {
                    // abort if not hero
                    if (node.alt !== 'ghost red') {
                        return;
                    }

                    js.wait_for_selector('#ghost_pages img.hbar', function(node) {
                        var width = parseFloat(node.style.width);
                        var max_width = 583;
                        var percent = width / max_width * 100;

                        var fill_bar = function() {
                            js.wait_for_selector('div.heroUpBar div.hfront', function(node) {
                                if (node.textContent !== '') {
                                    return setTimeout(function() {
                                        fill_bar();
                                    }, 50);
                                }
                                node.textContent = parseInt(percent) + '%';
                            });
                        };
                        fill_bar();
                    });
                });
            }, false);
        }
    };

    /**
     * Set tot true when the external tools bar is loaded.
     */
    var external_tools_loaded_ = false;

    /**
     * Load the configuration by merging the one found in the local storage (if
     * any) into the default one.
     */
    function load_configuration()
    {
        var saved_configuration = localStorage[LOCAL_STORAGE_D2NE_CONFIGURATION_KEY];

        if (js.is_defined(saved_configuration)) {
            configuration_ = js.merge(default_configuration_, JSON.parse(saved_configuration));
        } else {
            configuration_ = default_configuration_;
        }
    }

    /**
     * Save the configuration found in the configuration panel into the local
     * storage.
     */
    function save_configuration()
    {
        configuration_.enable_shortcuts = document.getElementById('d2ne_configuration_enable_shortcuts').checked;
        configuration_.hide_hero_adds = document.getElementById('d2ne_configuration_hide_hero_adds').checked;
        configuration_.highlight_ap = document.getElementById('d2ne_configuration_highlight_ap').checked;
        configuration_.hide_help = document.getElementById('d2ne_configuration_hide_help').checked;
        configuration_.hide_twinoid_bar = document.getElementById('d2ne_configuration_hide_twinoid_bar').checked;
        configuration_.hide_footer = document.getElementById('d2ne_configuration_hide_footer').checked;
        configuration_.hide_pegi = document.getElementById('d2ne_configuration_hide_pegi').checked;
        configuration_.hide_rookie_mode = document.getElementById('d2ne_configuration_hide_rookie_mode').checked;
        configuration_.hide_rp_content = document.getElementById('d2ne_configuration_hide_rp_content').checked;
        configuration_.external_tools.enable_bbh_sync = document.getElementById('d2ne_configuration_enable_bbh_sync').checked;
        configuration_.external_tools.enable_oeev_sync = document.getElementById('d2ne_configuration_enable_oeev_sync').checked;
        configuration_.enable_construction_max_ap = document.getElementById('d2ne_configuration_enable_construction_max_ap').checked;
        configuration_.hide_completed_constructions = document.getElementById('d2ne_configuration_hide_completed_constructions').checked;
        configuration_.enable_hero_bar_stat = document.getElementById('d2ne_configuration_enable_hero_bar_stat').checked;

        localStorage[LOCAL_STORAGE_D2NE_CONFIGURATION_KEY] = JSON.stringify(configuration_);
    }

    /**
     * Inject the configuration retrieved from the local storage.
     */
    function inject_configuration()
    {
        document.getElementById('d2ne_configuration_enable_shortcuts').checked = configuration_.enable_shortcuts;
        document.getElementById('d2ne_configuration_hide_hero_adds').checked = configuration_.hide_hero_adds;
        document.getElementById('d2ne_configuration_highlight_ap').checked = configuration_.highlight_ap;
        document.getElementById('d2ne_configuration_hide_help').checked = configuration_.hide_help;
        document.getElementById('d2ne_configuration_hide_twinoid_bar').checked = configuration_.hide_twinoid_bar;
        document.getElementById('d2ne_configuration_hide_footer').checked = configuration_.hide_footer;
        document.getElementById('d2ne_configuration_hide_pegi').checked = configuration_.hide_pegi;
        document.getElementById('d2ne_configuration_hide_rookie_mode').checked = configuration_.hide_rookie_mode;
        document.getElementById('d2ne_configuration_hide_rp_content').checked = configuration_.hide_rp_content;
        document.getElementById('d2ne_configuration_enable_bbh_sync').checked = configuration_.external_tools.enable_bbh_sync;
        document.getElementById('d2ne_configuration_enable_oeev_sync').checked = configuration_.external_tools.enable_oeev_sync;
        document.getElementById('d2ne_configuration_enable_construction_max_ap').checked = configuration_.enable_construction_max_ap;
        document.getElementById('d2ne_configuration_hide_completed_constructions').checked = configuration_.hide_completed_constructions;
        document.getElementById('d2ne_configuration_enable_hero_bar_stat').checked = configuration_.enable_hero_bar_stat;
    }

    function load_internationalisation()
    {
        var language = D2N_helpers.get_website_language();

        if (language === null) {
            language = 'en';
        }

        i18n_ = i18n[language];
    }

    /**
     * Fetch the external tools private keys.
     */
    function fetch_tools_private_keys()
    {
        // Drop private key cache when the user go on the settings page
        // (potential API key reset)
        document.addEventListener('d2n_hashchange', function() {
            if (!D2N_helpers.is_on_page('settings')) {
                return;
            }

            console.log('CLEAN CACHE');

            // Clean the cache for all the external tools
            for (var tool in external_tools_) {
                localStorage[external_tools_[tool].local_storage_key] = null;
            }
        });

        var enable_tool_in_config_panel, tool_info, match;
        var sk = D2N_helpers.get_sk(function(sk) {
            for (var tool in external_tools_) {
                tool_info = external_tools_[tool];

                if (localStorage[tool_info.local_storage_key] !== null) {
                    js.network_request('GET', '/disclaimer?id=' + tool_info.site_id + ';sk=' + sk,
                        null, null,
                        function(data, param) {
                            match = data.match(/<input type="hidden" name="key" value="([a-f0-9]{38})"\/>/);
                            if (js.is_defined(match)) {
                                localStorage[param.tool_info.local_storage_key] = match[1];
                                document.getElementById(param.tool_info.configuration_panel_id).disabled = false;
                            } else {
                                document.getElementById(param.tool_info.configuration_panel_id).disabled = true;
                            }
                        },
                        function(param) {
                            document.getElementById(param.tool_info.configuration_panel_id).disabled = true;
                        },
                        { tool_info: tool_info } );
                } else {
                    document.getElementById(tool_info.configuration_panel_id).disabled = false;
                }
            }
        });
    }

    /**
     * Update the external tools
     */
    function update_tools(tools_number)
    {
        var tools_updated = 0;
        var tools_update_aborted = 0;
        var tools_number = 0;

        var images = document.querySelectorAll('#d2ne_external_tools_bar a img');

        var show_calim = function() {
            images[0].style.display = 'inline';
            images[1].style.display = 'none';
            images[2].style.display = 'none';
            images[3].style.display = 'none';
        };

        var show_loading_wheel = function() {
            images[0].style.display = 'none';
            images[1].style.display = 'inline';
            images[2].style.display = 'none';
            images[3].style.display = 'none';
        };

        var show_smile = function() {
            images[0].style.display = 'none';
            images[1].style.display = 'none';
            images[2].style.display = 'inline';
            images[3].style.display = 'none';
        };

        var show_skull = function() {
            images[0].style.display = 'none';
            images[1].style.display = 'none';
            images[2].style.display = 'none';
            images[3].style.display = 'inline';
        };

        // Is called after each update
        var handle_tool_update = function() {
            // if error, show skull and abort
            if (tools_update_aborted > 0) {
                return show_skull();
            }

            // if all success, show happy smile and abort
            if (tools_updated === tools_number) {
                return show_smile();
            }
        };

        show_loading_wheel();

        for (var tool in configuration_.external_tools) {
            // if tool isn't enabled, skip it
            if (!(configuration_.external_tools[tool])) {
                continue;
            }

            var tool_name = tool.split('_')[1].split('_')[0];

            // if key hasn't been found, skip it
            if (!js.is_defined(localStorage[external_tools_[tool_name].local_storage_key])) {
                continue;
            }

            // else update it
            ++tools_number;
            external_tools_[tool_name].update(function(response) {
                tools_updated += 1;
                handle_tool_update();
            }, function(response) {
                tools_update_aborted += 1;
                handle_tool_update();
            });
        }
    }

    /**
     * Load all the external tools
     */
    function load_external_tools()
    {
        var load = function() {
            // if already loaded, abort
            if (external_tools_loaded_) {
                return;
            }

            // if not any tool is enabled, abort
            var tools_number = 0;
            for (var key in configuration_.external_tools) {
                tools_number += (configuration_.external_tools[key]) ? 1 : 0;
            }
            if (tools_number < 1) {
                return;
            }

            // if not in city or outside, abort
            if (!(D2N_helpers.is_in_city() || D2N_helpers.is_outside())) {
                return;
            }

            js.wait_for_id('main', function(node) {
                // Create and inject external tools bar style
                js.injectCSS(
                    '#d2neexternal_tools__bar {' +
                        'position: absolute;' +
                        'background-color: #5D321E;' +
                        'width: 303px;' +
                        'height: 30px;' +
                        'margin-left: 22px;' +
                        'margin-top: 222px;' +
                        'border: 1px solid rgb(240, 215, 158);' +
                        'border-radius: 9px;' +
                        'padding: 5px;' +
                        'padding-left: 8px;' +
                    '}' +
                    '#d2neexternal_tools__bar a.button {' +
                        'margin-right: auto;' +
                        'margin-left: auto;' +
                    '}' +
                    '#d2neexternal_tools__bar span {' +
                        'float: left;' +
                        'display: inline-block;' +
                        'vertical-align: middle;' +
                        'margin-top: 3px;' +
                        'margin-bottom: 3px;' +
                        'padding: 2px;' +
                        'cursor: help;' +
                        'background-color: #5c2b20;' +
                        'outline: 1px solid black;' +
                        'border: 1px solid #ad8051;' +
                        'padding-left: 7px;' +
                        'padding-right: 4px;' +
                    '}' +
                    '#d2neexternal_tools__bar a img {' +
                        'vertical-align: middle;' +
                        'margin-right: 4px;' +
                    '}' +
                    '#gameLayout td.sidePanel > div {' +
                        'top: 54px;' +
                        'position: relative;' +
                    '}' +
                    '#main2 {' +
                        'padding-bottom: 70px;' +
                    '}'
                );

                // Create external tools bar
                var external_tools_bar_div = js.jsonToDOM(
                    ["a", { "id": "d2neexternal_tools__bar" },
                        ["a", { "href": "javascript:void(0)", "id": "d2neexternal_tools__bar_update", "class": "button", "onclick": function() { update_tools(); } },
                            ["img", { "src": "/gfx/forum/smiley/h_calim.gif", "width": "19px", "height": "19px" }],
                            ["img", { "src": "/gfx/design/loading.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            ["img", { "src": "/gfx/forum/smiley/h_smile.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            ["img", { "src": "/gfx/forum/smiley/h_death.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            i18n_.external_tools_bar_update
                        ]
                    ]
                , document);

                // Insert external tools bar
                node.insertBefore(external_tools_bar_div, node.firstChild);
                external_tools_loaded_ = true;

                // Remove toolbar when leaving the city/outside page
                document.addEventListener('d2n_hashchange', function() {
                    if (!(D2N_helpers.is_in_city() || D2N_helpers.is_outside())) {
                        js.remove_DOM_node(document.getElementById("d2ne_external_tools_bar"));
                        js.injectCSS(
                            '#gameLayout td.sidePanel {' +
                                'position: static !important;' +
                            '}'
                        );
                    }
                }, false);
            });
        };

        if (window.location.hash !== '') {
            return load();
        }

        document.addEventListener('d2n_hashchange', function() {
            load();
        }, false);
    }

    /**
     * Create and inject the configuration panel.
     */
    function load_configuration_panel()
    {
        js.wait_for_id('main', function(node) {
            // Create and inject panel style
            js.injectCSS(
                '#d2ne_configuration_panel {' +
                    'margin-top:5px;' +
                    'position:absolute;' +
                    'margin-left:44px;' +
                    'z-index:9;' +
                    'background-color:#5c2b20;' +
                    'border: 1px solid #000000;' +
                '}' +

                '#d2ne_configuration_panel > div {' +
                    'border: 1px solid #f0d79e;' +
                    'padding-left:5px;' +
                    'padding-right:5px;' +
                '}' +

                '#d2ne_configuration_panel h1 {' +
                    'height:auto;' +
                    'font-size:8pt;' +
                    'text-transform:none;' +
                    'font-variant:small-caps;' +
                    'background:none;' +
                    'cursor:help;' +
                    'margin:0;' +
                    'padding:0;' +
                '}' +
                '#d2ne_configuration_panel:hover h1 {' +
                    'border-bottom:1px solid #b37c4a;' +
                    'margin-bottom:5px;' +
                '}' +

                '#d2ne_configuration_panel table {' +
                    'margin: 0 auto;' +
                    'width: 600px;' +
                '}' +
                '#d2ne_configuration_panel table tr:first-child td {' +
                    'padding-bottom: 6px;' +
                    'font-size: 9pt;' +
                    'line-height: 11pt;' +
                    'text-align: justify;' +
                    'border-bottom: 1px dashed #ddab76;' +
                '}' +
                '#d2ne_configuration_panel table tr:nth-child(2) td {' +
                    'padding-top: 6px;' +
                '}' +
                '#d2ne_configuration_panel table tr:nth-child(6) td:nth-child(-n + 2) {' +
                    'border-bottom: 1px dotted rgba(221, 171, 118, 0.5);' +
                '}' +
                '#d2ne_configuration_panel table tr:last-child td {' +
                    'padding-top: 4px;' +
                    'text-align: right;' +
                    'border-top: 1px dashed #ddab76;' +
                '}' +

                '#d2ne_configuration_panel table tr td:nth-child(2) {' +
                    'padding-right: 5px;' +
                    'border-right: 1px dotted rgba(221, 171, 118, 0.5);' +
                '}' +
                '#d2ne_configuration_panel table tr td:nth-child(3) {' +
                    'padding-left: 5px;' +
                '}' +

                '#d2ne_configuration_panel a.button {' +
                    'width: auto;' +
                    'margin: 3px 0 3px 0;' +
                    'text-align: center;' +
                    'padding: 0;' +
                '}' +

                'a.d2n_tooltip {' +
                    'display: inline;' +
                    'position: relative;' +
                    'cursor: help' +
                '}' +
                'a.d2n_tooltip img {' +
                    'margin-left: 4px;' +
                    'margin-top: 2px;' +
                    'border: 1px solid #5c2b20;' +
                '}' +
                'a.d2n_tooltip img:hover {' +
                    'border: 1px solid #ffffff;' +
                '}' +
                'a.d2n_tooltip:hover:after {' +
                    'z-index: 98;' +
                    'position: absolute;' +
                    'top: -3px;' +
                    'left: 60px;' +
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
                '}'
            );

            var config_panel_div = js.jsonToDOM(
                ["html:div", { "id": "d2ne_configuration_panel" },
                    ["div", {},
                        ["h1", {},
                            ["img", { "src": "/gfx/forum/smiley/h_city_up.gif", "alt": "" }],
                            ["span", { "style": "display: none;" }, ' ' + i18n_.configuration_panel_title]
                        ],

                        ["div", { "style": "display: none;" },
                            ["table", {},
                                ["tr", {},
                                    ["td", { "colspan": 4 }, i18n_.configuration_panel_script_description]
                                ],

                                // First row
                                ["tr", {},
                                    // Enable shortcuts
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_shortcuts", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_enable_shortcuts" }, i18n_.configuration_panel_enable_shortcuts]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_shortcuts_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide hero adds
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_hero_adds", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_hero_adds" }, i18n_.configuration_panel_hide_hero_adds],
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_hero_adds_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Second row
                                ["tr", {},
                                    // Highlight AP
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_highlight_ap", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_highlight_ap" }, i18n_.configuration_panel_highlight_ap]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_highlight_ap_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide help
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_help", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_help" }, i18n_.configuration_panel_hide_help]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_help_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Third row
                                ["tr", {},
                                    // Enable construction max AP
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_construction_max_ap", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_enable_construction_max_ap" }, i18n_.configuration_panel_enable_construction_max_ap]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_construction_max_ap_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide Twinoid bar
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_twinoid_bar", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_twinoid_bar" }, i18n_.configuration_panel_hide_twinoid_bar]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_twinoid_bar_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Fourth row
                                ["tr", {},
                                    // Hide completed constructions
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_completed_constructions", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_completed_constructions" }, i18n_.configuration_panel_hide_completed_constructions]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_completed_constructions_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide Footer
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_footer", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_footer" }, i18n_.configuration_panel_hide_footer]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_footer_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Fifth row
                                ["tr", {},
                                    // Enable hero bar stat
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_hero_bar_stat", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_enable_hero_bar_stat" }, i18n_.configuration_panel_enable_hero_bar_stat]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_hero_bar_stat_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide PEGI
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_pegi", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_pegi" }, i18n_.configuration_panel_hide_pegi]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_pegi_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Sixth row
                                ["tr", {},
                                    // Enable BBH sync
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_bbh_sync", "type": "checkbox", "disabled": "disabled" }],
                                        ["label", { "for": "d2ne_configuration_enable_bbh_sync" }, i18n_.configuration_panel_enable_bbh_sync]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_bbh_sync_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide rookie mode
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_rookie_mode", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_rookie_mode" }, i18n_.configuration_panel_hide_rookie_mode]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_rookie_mode_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Seventh row
                                ["tr", {},
                                    // Enable oeev sync
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_oeev_sync", "type": "checkbox", "disabled": "disabled" }],
                                        ["label", { "for": "d2ne_configuration_enable_oeev_sync" }, i18n_.configuration_panel_enable_oeev_sync]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_oeev_sync_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide RP content
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_rp_content", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_rp_content" }, i18n_.configuration_panel_hide_rp_content]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_rp_content_tooltip },
                                            ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                ["tr", {},
                                    ["td", { "colspan": 4 },
                                        ["a", { "href": "javascript:void(0)", "id": "d2ne_configuration_save", "class": "button",
                                                "onclick": function() { save_configuration(); js.reload(); } },
                                              i18n_.configuration_panel_save_button]
                                    ]
                                ],

                                ["tr", {},
                                    ["td", { "colspan": 4 },
                                        ["a", { "href": PROJECT_PAGE, "target": "_blank" }, SCRIPT_NAME + ' v' + SCRIPT_VERSION]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            , document);

            // Insert panel
            node.insertBefore(config_panel_div, node.firstChild);

            // Inject configuration
            inject_configuration();

            // Show/Hide config panel cache
            var config_panel_cache = document.getElementById('d2ne_configuration_panel');
            var config_panel_toggled_elements_cache = document.querySelectorAll('#d2ne_configuration_panel > div > h1 > span, #d2ne_configuration_panel > div > div');
            var config_panel_toggled_elements_cache_length = config_panel_toggled_elements_cache.length;

            // Show panel on hover
            config_panel_div.addEventListener('mouseover', function() {
                config_panel_cache.style['z-index'] = '11'; // This fix is needed for the spanish version, as the hero adds has a z-index of 10
                for (var i = 0; i < config_panel_toggled_elements_cache_length; ++i) {
                    config_panel_toggled_elements_cache[i].style.display = 'inline';
                }
            }, false);

            // Hide panel on mouse out
            config_panel_div.addEventListener('mouseout', function() {
                for (var i = 0; i < config_panel_toggled_elements_cache_length; ++i) {
                    config_panel_toggled_elements_cache[i].style.display = 'none';
                }
                config_panel_cache.style['z-index'] = '9'; // See previous function comment
            }, false);
        });
    }

    /**
     * Load all the script features (depending of the configuration)
     */
    function load_features()
    {
        // Browse all features, and check if they have to be activated
        for (var feature in features_) {
            if (configuration_[feature] === true) {
                (features_[feature])();
            }
        }
    }

/*
*/

    return {
        init: init
    };

})();
