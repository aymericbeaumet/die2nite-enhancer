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
        import_configuration(); // from local storage
        load_internationalisation(); // load translations
        load_features(); // load all the features (only the ones found in the configuration)
        load_configuration_panel(); // loading is deferred until #main is found

        D2N_helpers.is_logged(function(logged) { if (logged) {
            fetch_tools_private_keys();
            load_external_tools_bar(); // only if at least one tool is enabled
            D2N_helpers.add_custom_events(); // add custom D2N events
        }});
    };

/*
  private:
*/

    var LOCAL_STORAGE_PREFIX = 'extensions.d2ne';
    var LOCAL_STORAGE_D2NE_CONFIGURATION_KEY = LOCAL_STORAGE_PREFIX + '.configuration';
    var LOCAL_STORAGE_PRIVATE_KEY_PREFIX = LOCAL_STORAGE_PREFIX + '.key';

    var DOM_PREFIX = 'd2ne';
    var CONFIGURATION_PANEL_ID_PREFIX = DOM_PREFIX + '_configuration_panel';
    var CONFIGURATION_PANEL_ID_PREFIX_EXTERNAL_TOOLS = CONFIGURATION_PANEL_ID_PREFIX + '_enable_sync';

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
        hide_hero_adds: false,

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
        enable_sync: {

            //
            // www.hordes.fr
            //

            // Set to true to enable BigBroth'Hordes (http://bbh.fred26.fr/)
            bbh: false,
            // Set to true to enable Où en êtes-vous ? (http://www.oeev-hordes.com/)
            oeev: false,

            //
            // www.die2nite.com
            //

            // Set to true to enable Dusk Dawn (http://d2n.duskdawn.net/)
            duskdawn: false,
            // Set to true to enable Map Viewer (http://die2nite.gamerz.org.uk/)
            mapviewer: false
        },

        // Set to true to enable the use of maximum AP in the constructions
        enable_construction_max_ap: false,

        // Set to true to enable the stat on hero bar
        enable_hero_bar_stat: true,

        // Set to true to enable the cyanide protection
        enable_cyanide_protection: false,

        // Set to false to disable the "Highlight completed constructions" link
        enable_hide_completed_constructions: true,

        // Set to false to show the Twitter share button (on Gazette)
        hide_twitter_share_button: true,

        /*
         * Not configurable by the user from the configuration panel
         */

        // Set to true to hide completed constructions
        hide_completed_constructions: false
    };

    /**
     * External tools
     */
    var external_tools_ = {

        oeev: {
            site_id: {
                'www.hordes.fr': 22
            },
            local_storage_key: LOCAL_STORAGE_PRIVATE_KEY_PREFIX + '.oeev',
            update: function(callback_success, callback_failure) {
                js.network_request(
                    'POST',
                    'http://www.oeev-hordes.com/',
                    'key=' + localStorage[external_tools_.oeev.local_storage_key] + '&mode=json',
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        var json = JSON.parse(response_text);
                        if ('response' in json && json.response === 'Site mis à jour') {
                            return callback_success();
                        }
                        return callback_failure();
                    },
                    function() {
                        return callback_failure();
                    }
                );
            }
        },

        bbh: {
            site_id: {
                'www.hordes.fr': 51
            },
            local_storage_key: LOCAL_STORAGE_PRIVATE_KEY_PREFIX + '.bbh',
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
        },

        duskdawn: {
            site_id: {
                'www.die2nite.com': 14
            },
            local_storage_key: LOCAL_STORAGE_PRIVATE_KEY_PREFIX + '.duskdawn',
            update: function(callback_success, callback_failure) {
                // Do not update if not outside
                if (!D2N_helpers.is_outside()) {
                    return callback_success();
                }

                js.network_request(
                    'POST',
                    'http://d2n.duskdawn.net/zone',
                    'key=' + localStorage[external_tools_.duskdawn.local_storage_key],
                    {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    function(response_text) {
                        var json = JSON.parse(response_text);
                        if ('errorCode' in json || 'errorMessage' in json) {
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

        mapviewer: {
            site_id: {
                'www.die2nite.com': 1
            },
            local_storage_key: LOCAL_STORAGE_PRIVATE_KEY_PREFIX + '.mapviewer',
            update: function(callback_success, callback_failure) {
                js.network_request(
                    'GET',
                    'http://die2nite.gamerz.org.uk/ajax/update_current_zone',
                    'key=' + localStorage[external_tools_.mapviewer.local_storage_key],
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    function(response_text) {
                        try {
                            var json = JSON.parse(response_text);
                            if ('status' in json && json.status == 1) {
                                return callback_success();
                            }
                            return callback_failure();
                        } catch (e) {
                            return callback_failure();
                        }
                    },
                    function() {
                        return callback_failure();
                    }
                );
            }
        }
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
     * Remember if an external tool update is currently in progress.
     */
    var update_in_progress_ = false;

    /**
     * All features available in this extension
     */
    var features_ = {

        ////
        hide_hero_adds: function() {
            js.injectCSS(
                '.heroMode, #ghostHeroAd, #heroContainer, .heroAd, #ghostHeroChoose, .promoBt, .sondageBg {' +
                    'display: none !important;' +
                '}'
            );
        },

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
                'div#generic_section div.exp {' +
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
        hide_twitter_share_button: function() {
            js.injectCSS(
                '#gameBodyLight ul.linkControl {' +
                    'display: none;' +
                '}'
            );
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
        },

        ////
        enable_hide_completed_constructions: function() {
            if (!D2N_helpers.is_in_city()) {
                return;
            }

            // Hide constructions if needed | Add the link
            var add_link = function() {
                // Abort if not on the building page
                if (!D2N_helpers.is_on_page_in_city('buildings')) {
                    return;
                }

                // Hide the constructions if needed
                if (configuration_.hide_completed_constructions) {
                    js.injectCSS(
                        'tr.building.done {' +
                            'display: none;' +
                        '}'
                    );
                // Else show the constructions
                } else {
                    js.injectCSS(
                        'tr.building.done {' +
                            'display: table-row;' +
                        '}'
                    );
                }

                js.wait_for_class('tinyAction', function(nodes) {
                    // if the two links are already present, then abort
                    if (nodes[0].childNodes.length > 1) {
                        return;
                    }

                    var right_link = nodes[0].firstChild;

                    // Clone node and set the wanted properties (to keep the
                    // right link behaviour)
                    var link = right_link.cloneNode(false);
                    link.style.cssFloat = 'left';
                    link.textContent = configuration_.hide_completed_constructions ? i18n_.show_completed_constructions : i18n_.hide_completed_constructions;
                    link.addEventListener('click', function() {
                        configuration_.hide_completed_constructions = !configuration_.hide_completed_constructions;
                        save_configuration();
                    }, false);

                    nodes[0].insertBefore(link, nodes[0].firstChild);
                });
            };
            add_link();

            // Add the link again on each page reload
            document.addEventListener('d2n_gamebody_reload', function() {
                add_link();
            }, false);

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

            document.addEventListener('d2n_gamebody_reload', function() {
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
                        // Notes:
                        //   0 day -> 0px
                        var max_width = 583;
                        var percent = width / max_width * 100;

                        var fill_bar = function() {
                            js.wait_for_selector('div.heroUpBar div.hfront', function(node) {
                                node.textContent = parseInt(percent) + '%';
                            });
                        };
                        fill_bar();
                    });
                });
            }, false);
        },

        ////
        enable_cyanide_protection: function() {
            var remove_cyanide_action = function() {
                // if not at home or outside (the two only places where a player
                // can use an object), abort
                if (!(D2N_helpers.is_on_page_in_city('home') || D2N_helpers.is_outside())) {
                    return;
                }

                // else list all the possible objects usable by the player
                js.wait_for_selector_all('a.toolAction > span > strong', function(nodes) {
                    var action;

                    for (var node in nodes) {
                        // Skip the node if not a 'strong' element
                        if (nodes[node].nodeName !== 'STRONG')
                            continue;

                        // Hide the node if cyanure
                        if (/^Cyanide|Cyanure|Cianuro$/.test(nodes[node].textContent)) {
                            action = nodes[node].parentNode.parentNode;
                            action.style.display = 'none';
                        }
                    }
                }, 5);
            };

            document.addEventListener('d2n_gamebody_reload', function() {
                remove_cyanide_action();
            }, false);
        }
    };

    /**
     * Load the configuration by merging the one found in the local storage (if
     * any) into the default one.
     */
    function import_configuration()
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
        var save = function(obj, prefix) {
            for (var key in obj) {
                if (typeof obj[key] === 'object') {
                    save(obj[key], prefix + key + '_')
                    continue;
                }

                var el = document.getElementById(prefix + key);

                if (!js.is_defined(el)) {
                    continue;
                }
                obj[key] = el.checked;
            }
        };
        save(configuration_, CONFIGURATION_PANEL_ID_PREFIX + '_');

        localStorage[LOCAL_STORAGE_D2NE_CONFIGURATION_KEY] = JSON.stringify(configuration_);
    }

    /**
     * Inject in the configuration panel the configuration retrieved from the
     * local storage.
     */
    function inject_configuration()
    {
        var inject = function(obj, prefix) {
            for (var key in obj) {
                if (typeof obj[key] === 'object') {
                    inject(obj[key], prefix + key + '_')
                    continue;
                }

                var el = document.getElementById(prefix + key);

                if (!js.is_defined(el)) {
                    continue;
                }
                el.checked = obj[key];
            }
        };
        inject(configuration_, CONFIGURATION_PANEL_ID_PREFIX + '_');
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
        document.addEventListener('d2n_gamebody_reload', function() {
            if (!D2N_helpers.is_on_page('settings')) {
                return;
            }

            // Clean the cache for all the external tools
            for (var tool in external_tools_) {
                localStorage[external_tools_[tool].local_storage_key] = null;
            }
        });

        // Abort if on the settings page
        if (D2N_helpers.is_on_page('settings')) {
            return;
        }

        // Display the given button by setting its parent node display CSS
        // property
        var enable_button = function(button_id) {
            js.wait_for_id(button_id, function(node) {
                node.parentNode.style.display = 'block'; // display the concerned row
            });
        };

        var enable_tool_in_config_panel, tool_info, match;
        D2N_helpers.get_sk(function(sk) {
            var tool;

            // Browse all the external tools
            for (var tool_name in external_tools_) {
                var configuration_panel_id = CONFIGURATION_PANEL_ID_PREFIX_EXTERNAL_TOOLS + '_' + tool_name;

                tool = external_tools_[tool_name];

                // if this tool is disabled, go to the next one
                if (localStorage[tool.local_storage_key] == -1) {
                    continue;
                }

                // if the tool is not adapted to this website, disable it and
                // skip to the next one
                if (!(D2N_helpers.get_website() in tool.site_id)) {
                    localStorage[tool.local_storage_key] = -1;
                    continue;
                }

                // if key already exists, enable config panel corresponding
                // button and skip to the next tool
                if (js.match_regex(localStorage[tool.local_storage_key], '^[a-f0-9]{38,39}$')) {
                    enable_button(configuration_panel_id);
                    continue;
                }

                // Else fetch its key, enable the button if needed
                js.network_request('GET', '/disclaimer?id=' + tool.site_id[D2N_helpers.get_website()] + ';sk=' + sk, null, null,
                    function on_success(data, context) {
                        match = data.match(/<input type="hidden" name="key" value="([a-f0-9]{38,39})"\/>/);
                        if (js.is_defined(match) && match.length === 2) {
                            localStorage[context.local_storage_key] = match[1]; // save the API key
                            enable_button(context.configuration_panel_id);
                        } else {
                            localStorage[context.local_storage_key] = -1; // disable this tool
                        }
                    }, null,
                    {
                        local_storage_key: tool.local_storage_key,
                        configuration_panel_id: configuration_panel_id
                    } // context given to callback
                );
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

        // Disable the toolbar
        var disable_toolbar = function() {
            update_in_progress_ = true;
            js.wait_for_id(DOM_PREFIX + '_external_tools_bar_update', function(node) {
                node.classList.add('off');
            });
        };

        // Enable the toolbar
        var enable_toolbar = function() {
            js.wait_for_id(DOM_PREFIX + '_external_tools_bar_update', function(node) {
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

        for (var tool in configuration_.enable_sync) {
            // if tool isn't enabled, skip it
            if (!(configuration_.enable_sync[tool])) {
                continue;
            }

            // if key hasn't been found, skip it
            if (!js.is_defined(localStorage[external_tools_[tool].local_storage_key])) {
                continue;
            }

            // else update it
            ++tools_number;
            external_tools_[tool].update(function(response) {
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
    function load_external_tools_bar()
    {
        // if not any tool is enabled, abort
        var tools_number = 0;
        for (var key in configuration_.enable_sync) {
            tools_number += (configuration_.enable_sync[key]) ? 1 : 0;
        }
        if (tools_number < 1) {
            return;
        }

        // Create and inject external tools bar style
        js.injectCSS(
            '#' + DOM_PREFIX + '_external_tools_bar {' +
                'background-color: #5D321E;' +
                'width: 303px;' +
                'height: 30px;' +
                'margin-left: 3px;' +
                'margin-top: 5px;' +
                'margin-bottom: 7px;' +
                'border: 1px solid rgb(240, 215, 158);' +
                'border-radius: 9px;' +
                'padding: 5px;' +
                'padding-left: 8px;' +
            '}' +
            '#' + DOM_PREFIX + '_external_tools_bar a.button {' +
                'margin-right: auto;' +
                'margin-left: auto;' +
            '}' +
            '#' + DOM_PREFIX + '_external_tools_bar span {' +
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
            '#' + DOM_PREFIX + '_external_tools_bar a img {' +
                'vertical-align: middle;' +
                'margin-right: 4px;' +
            '}'
        );

        var inject_tools_button = function() {
            // if not in town or outside, abort
            if (!(D2N_helpers.is_in_city() || D2N_helpers.is_outside())) {
                return;
            }

            // the side panel is needed to place the button
            js.wait_for_class('sidePanel', function(nodes) {
                // if already loaded, abort
                if (js.is_defined(document.getElementById(DOM_PREFIX + '_external_tools_bar'))) {
                    return;
                }

                // Create external tools bar
                var external_tools_bar_div = js.jsonToDOM(
                    ["div", { "id": DOM_PREFIX + "_external_tools_bar" },
                        ["a", { "href": "javascript:void(0)", "id": DOM_PREFIX + "_external_tools_bar_update", "class": "button", "onclick": function() { update_tools(); } },
                            ["img", { "src": "/gfx/forum/smiley/h_calim.gif", "width": "19px", "height": "19px" }],
                            ["img", { "src": "/gfx/design/loading.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            ["img", { "src": "/gfx/forum/smiley/h_smile.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            ["img", { "src": "/gfx/forum/smiley/h_death.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            i18n_.external_tools_bar_update
                        ]
                    ]
                , document);

                // Insert external tools bar
                nodes[0].insertBefore(external_tools_bar_div, nodes[0].firstChild);
            });
        };

        // Inject button on load
        inject_tools_button();

        // Inject button each time the gamebody is reloaded
        document.addEventListener('d2n_gamebody_reload', function() {
            inject_tools_button();
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

                '#' + DOM_PREFIX + '_configuration_panel {' +
                    'z-index: 9;' +
                    'position: absolute;' +
                    'margin-top: 5px;' +
                    'margin-left: 44px;' +
                    'background-color: #5c2b20;' +
                    'border: 1px solid #000000;' +
                    'max-width: 430px;' +
                '}' +

                '#' + DOM_PREFIX + '_configuration_panel h1 {' +
                    'height: auto;' +
                    'font-size: 8pt;' +
                    'text-transform: none;' +
                    'font-variant: small-caps;' +
                    'background: none;' +
                    'cursor: help;' +
                    'margin: 0;' +
                    'padding: 0;' +
                '}' +
                '#' + DOM_PREFIX + '_configuration_panel:hover h1 {' +
                    'border-bottom: 1px solid #b37c4a;' +
                    'margin-bottom: 5px;' +
                '}' +

                '#' + DOM_PREFIX + '_configuration_panel > div {' +
                    'line-height: 23px;' +
                    'border: 1px solid #f0d79e;' +
                    'padding-left: 5px;' +
                    'padding-right: 5px;' +
                '}' +

                '#' + DOM_PREFIX + '_configuration_panel p {' +
                    'padding-bottom: 7px;' +
                    'margin-bottom: 3px;' +
                    'font-size: 9pt;' +
                    'line-height: 11pt;' +
                    'text-align: justify;' +
                    'border-bottom: 1px dashed #ddab76;' +
                '}' +

                '#' + DOM_PREFIX + '_configuration_panel div > div {' +
                    'position: relative;' +
                '}' +
                '#' + DOM_PREFIX + '_configuration_panel div > div img {' +
                    'position: absolute;' +
                    'top: 0;' +
                    'bottom: 0;' +
                    'right: 0;' +
                    'margin: auto;' +
                    'margin-right: 4px;' +
                '}' +

                '#' + DOM_PREFIX + '_configuration_panel hr {' +
                    'border-top: 1px dotted rgba(221, 171, 118, 0.8);' +
                    'margin: 0;' +
                    'margin-top: 3px;' +
                    'margin-bottom: 3px;' +
                '}' +

                'a.' + DOM_PREFIX + '_tooltip {' +
                    'display: inline;' +
                    'cursor: help' +
                '}' +
                'a.' + DOM_PREFIX + '_tooltip img {' +
                    'border: 1px solid #5c2b20;' +
                '}' +
                'a.' + DOM_PREFIX + '_tooltip img:hover {' +
                    'border: 1px solid #ffffff;' +
                '}' +
                'a.' + DOM_PREFIX + '_tooltip:hover:after {' +
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

                '#' + DOM_PREFIX + '_configuration_panel > div > div > div:last-child {' +
                    'text-align: right;' +
                '}' +

                '#' + DOM_PREFIX + '_configuration_panel a.button {' +
                    'width: auto;' +
                    'text-align: center;' +
                    'padding: 0;' +
                    'padding-top: 2px;' +
                    'height: 19px;' +
                    'margin: 0;' +
                    'margin-top: 5px;' +
                '}'
            );

            var config_panel_div = js.jsonToDOM(
                ["div", { "id": CONFIGURATION_PANEL_ID_PREFIX },
                    ["div", {},
                        ["h1", {},
                            ["img", { "src": "/gfx/forum/smiley/h_city_up.gif", "alt": "" }],
                            ["span", { "style": "display: none;" }, ' ' + i18n_.configuration_panel_title]
                        ],

                        ["div", { "style": "display: none;" },
                            ["p", {}, i18n_.configuration_panel_script_description],

                            /*
                             * First category
                             */

                            // Enable shortcuts
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_shortcuts", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_shortcuts" }, i18n_.configuration_panel_enable_shortcuts],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_shortcuts_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Highlight AP
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_highlight_ap", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_highlight_ap" }, i18n_.configuration_panel_highlight_ap],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_highlight_ap_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Enable construction max AP
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_construction_max_ap", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_construction_max_ap" }, i18n_.configuration_panel_enable_construction_max_ap],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_construction_max_ap_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Hide completed constructions
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_hide_completed_constructions", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_hide_completed_constructions" }, i18n_.configuration_panel_enable_hide_completed_constructions],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_hide_completed_constructions_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Enable hero bar stat
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_hero_bar_stat", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_hero_bar_stat" }, i18n_.configuration_panel_enable_hero_bar_stat],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_hero_bar_stat_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Enable cyanide protection
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_cyanide_protection", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_cyanide_protection" }, i18n_.configuration_panel_enable_cyanide_protection],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_cyanide_protection_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            ["hr", {}],

                            // Enable BBH sync
                            ["div", { "style": "display: none;" },
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_sync_bbh", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_sync_bbh" }, i18n_.configuration_panel_enable_bbh_sync],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_bbh_sync_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Enable OEEV sync
                            ["div", { "style": "display: none;" },
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_sync_oeev", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_sync_oeev" }, i18n_.configuration_panel_enable_oeev_sync],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_oeev_sync_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Enable DuskDawn sync
                            ["div", { "style": "display: none;" },
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_sync_duskdawn", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_sync_duskdawn" }, i18n_.configuration_panel_enable_duskdawn_sync],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_duskdawn_sync_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Enable MapViewer sync
                            ["div", { "style": "display: none;" },
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_enable_sync_mapviewer", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_enable_sync_mapviewer" }, i18n_.configuration_panel_enable_mapviewer_sync],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_enable_mapviewer_sync_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            /*
                             * Second category
                             */
                            ["hr", {}],

                            // Hide hero adds
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_hide_hero_adds", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_hide_hero_adds" }, i18n_.configuration_panel_hide_hero_adds],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_hero_adds_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Hide help
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_hide_help", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_hide_help" }, i18n_.configuration_panel_hide_help],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_help_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Hide Twinoid bar
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_hide_twinoid_bar", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_hide_twinoid_bar" }, i18n_.configuration_panel_hide_twinoid_bar],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_twinoid_bar_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Hide Footer
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_hide_footer", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_hide_footer" }, i18n_.configuration_panel_hide_footer],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_footer_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Hide PEGI
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_hide_pegi", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_hide_pegi" }, i18n_.configuration_panel_hide_pegi],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_pegi_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Hide rookie mode
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_hide_rookie_mode", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_hide_rookie_mode" }, i18n_.configuration_panel_hide_rookie_mode],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_rookie_mode_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Hide RP content
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_hide_rp_content", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_hide_rp_content" }, i18n_.configuration_panel_hide_rp_content],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_rp_content_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            // Hide Twitter share button
                            ["div", {},
                                ["input", { "id": CONFIGURATION_PANEL_ID_PREFIX + "_hide_twitter_share_button", "type": "checkbox" }],
                                ["label", { "for": CONFIGURATION_PANEL_ID_PREFIX + "_hide_twitter_share_button" }, i18n_.configuration_panel_hide_twitter_share],
                                ["a", { "class": DOM_PREFIX + "_tooltip", "href": "javascript:void(0)", "tooltip": i18n_.configuration_panel_hide_twitter_share_tooltip },
                                    ["img", { "src": i18n_.help_image_url, "alt": "" }],
                                ]
                            ],

                            ["p", {},
                                ["a", { "href": "javascript:void(0)", "id": CONFIGURATION_PANEL_ID_PREFIX + "_save", "class": "button",
                                        "onclick": function() { save_configuration(); js.reload(); } },
                                    i18n_.configuration_panel_save_button]
                            ],

                            ["div", {},
                                ["a", { "href": PROJECT_PAGE, "target": "_blank" }, SCRIPT_NAME + ' v' + SCRIPT_VERSION]
                            ]
                        ]
                    ]
                ]
            , document);

            // Insert panel
            node.insertBefore(config_panel_div, node.firstChild);

            // Inject configuration in the config panel (in the DOM)
            inject_configuration();

            // Show/Hide config panel cache
            var config_panel_toggled_elements_cache = document.querySelectorAll('#' + DOM_PREFIX + '_configuration_panel > div > h1 > span, #' + DOM_PREFIX + '_configuration_panel > div > div');
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

    /**
     * Load all the script features (depending of the configuration)
     */
    function load_features()
    {
        // Browse all features, and check if they have to be activated regarding
        // to the configuration
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
