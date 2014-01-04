// ==UserScript==
//
// You need Google Chrome 13+ or Mozilla Firefox with Greasemonkey 0.9.8+ to use
// this script.
//
// @name Die2Nite Enhancer
// @version 0.0.1
// @description Enhance your game experience!
// @author Aymeric Beaumet <aymeric@beaumet.me>
// @license zlib/libpng http://opensource.org/licenses/Zlib
// @icon http://www.zombinoia.com/gfx/forum/smiley/h_city_up.gif
// @downloadURL https://github.com/abeaumet/die2nite_enhancer/raw/master/die2nite_enhancer.user.js
// @updateURL https://github.com/abeaumet/die2nite_enhancer/raw/master/die2nite_enhancer.user.js
//
// @match http://www.die2nite.com/*
// @match http://www.hordes.fr/*
// @match http://www.zombinoia.com/*
// @match http://www.dieverdammten.de/*
//
// @grant GM_xmlhttpRequest
// @match http://bbh.fred26.fr/*
// @exclude http://bbh.fred26.fr/*
// @match http://www.oeev-hordes.com/*
// @exclude http://www.oeev-hordes.com/*
//
// ==/UserScript==

;(function(undefined) {

"use strict";


/**
 * Script informations
 */
var SCRIPT_NAME = 'Die2Nite Enhancer';
var SCRIPT_VERSION = '0.0.1';
var PROJECT_PAGE = 'https://github.com/abeaumet/die2nite_enhancer';


/**
 * Internationalisation
 */
var i18n = {
    en: {
        script_description: 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.',
        help_image_url: '/gfx/loc/en/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Settings',
        configuration_panel_enable_shortcuts: 'Enable shortcuts',
        configuration_panel_enable_shortcuts_tooltip: 'Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).',
        configuration_panel_hide_hero_adds: 'Hide hero adds',
        configuration_panel_hide_hero_adds_tooltip: 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.',
        configuration_panel_highlight_ap: 'Highlight AP',
        configuration_panel_highlight_ap_tooltip: 'Add a border with a specific color (from red to green) in function of the remaining number of action point.',
        configuration_panel_hide_help: 'Hide help',
        configuration_panel_hide_help_tooltip: 'Hide the blue help boxes in the interface.',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen. Put your mouse near the top of the screen to show it again.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_guides: 'Hide guides',
        configuration_panel_hide_guides_tooltip: 'Hide all the guides and the help tooltips.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content.',
        configuration_panel_enable_bbh_sync: 'Enable <a href="http://bbh.fred26.fr/" target="_blank">BBH</a> sync',
        configuration_panel_enable_bbh_sync_tooltip: 'Add the possibility to sync with BigBroth\'Hordes. If an error occurs, be sure you are logged in.',
        configuration_panel_enable_ooev_sync: 'Enable <a href="http://www.oeev-hordes.com/" target="_blank">OOEV</a> sync',
        configuration_panel_enable_ooev_sync_tooltip: 'Add the possibility to sync with Où en êtes-vous ?. If an error occurs, be sure you are logged in.',
        configuration_panel_save_button: 'Save',
        external_tools_bar_update: 'Update external tools'
    },

    fr: {
        script_description: 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.',
        help_image_url: '/gfx/loc/fr/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Settings',
        configuration_panel_enable_shortcuts: 'Enable shortcuts',
        configuration_panel_enable_shortcuts_tooltip: 'Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).',
        configuration_panel_hide_hero_adds: 'Hide hero adds',
        configuration_panel_hide_hero_adds_tooltip: 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.',
        configuration_panel_highlight_ap: 'Highlight AP',
        configuration_panel_highlight_ap_tooltip: 'Add a border with a specific color (from red to green) in function of the remaining number of action point.',
        configuration_panel_hide_help: 'Hide help',
        configuration_panel_hide_help_tooltip: 'Hide the blue help boxes in the interface.',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen. Put your mouse near the top of the screen to show it again.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_guides: 'Hide guides',
        configuration_panel_hide_guides_tooltip: 'Hide all the guides and the help tooltips.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content.',
        configuration_panel_enable_bbh_sync: 'Enable <a href="http://bbh.fred26.fr/" target="_blank">BBH</a> sync',
        configuration_panel_enable_bbh_sync_tooltip: 'Add the possibility to sync with BigBroth\'Hordes. If an error occurs, be sure you are logged in.',
        configuration_panel_enable_ooev_sync: 'Enable <a href="http://www.oeev-hordes.com/" target="_blank">OOEV</a> sync',
        configuration_panel_enable_ooev_sync_tooltip: 'Add the possibility to sync with Où en êtes-vous ?. If an error occurs, be sure you are logged in.',
        configuration_panel_save_button: 'Save',
        external_tools_bar_update: 'Update external tools'
    },

    es: {
        script_description: 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.',
        help_image_url: '/gfx/loc/es/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Settings',
        configuration_panel_enable_shortcuts: 'Enable shortcuts',
        configuration_panel_enable_shortcuts_tooltip: 'Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).',
        configuration_panel_hide_hero_adds: 'Hide hero adds',
        configuration_panel_hide_hero_adds_tooltip: 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.',
        configuration_panel_highlight_ap: 'Highlight AP',
        configuration_panel_highlight_ap_tooltip: 'Add a border with a specific color (from red to green) in function of the remaining number of action point.',
        configuration_panel_hide_help: 'Hide help',
        configuration_panel_hide_help_tooltip: 'Hide the blue help boxes in the interface.',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen. Put your mouse near the top of the screen to show it again.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_guides: 'Hide guides',
        configuration_panel_hide_guides_tooltip: 'Hide all the guides and the help tooltips.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content.',
        configuration_panel_enable_bbh_sync: 'Enable <a href="http://bbh.fred26.fr/" target="_blank">BBH</a> sync',
        configuration_panel_enable_bbh_sync_tooltip: 'Add the possibility to sync with BigBroth\'Hordes. If an error occurs, be sure you are logged in.',
        configuration_panel_enable_ooev_sync: 'Enable <a href="http://www.oeev-hordes.com/" target="_blank">OOEV</a> sync',
        configuration_panel_enable_ooev_sync_tooltip: 'Add the possibility to sync with Où en êtes-vous ?. If an error occurs, be sure you are logged in.',
        configuration_panel_save_button: 'Save',
        external_tools_bar_update: 'Update external tools'
    },

    de: {
        script_description: 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.',
        help_image_url: '/gfx/loc/de/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Settings',
        configuration_panel_enable_shortcuts: 'Enable shortcuts',
        configuration_panel_enable_shortcuts_tooltip: 'Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).',
        configuration_panel_hide_hero_adds: 'Hide hero adds',
        configuration_panel_hide_hero_adds_tooltip: 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.',
        configuration_panel_highlight_ap: 'Highlight AP',
        configuration_panel_highlight_ap_tooltip: 'Add a border with a specific color (from red to green) in function of the remaining number of action point.',
        configuration_panel_hide_help: 'Hide help',
        configuration_panel_hide_help_tooltip: 'Hide the blue help boxes in the interface.',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen. Put your mouse near the top of the screen to show it again.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_guides: 'Hide guides',
        configuration_panel_hide_guides_tooltip: 'Hide all the guides and the help tooltips.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content.',
        configuration_panel_enable_bbh_sync: 'Enable <a href="http://bbh.fred26.fr/" target="_blank">BBH</a> sync',
        configuration_panel_enable_bbh_sync_tooltip: 'Add the possibility to sync with BigBroth\'Hordes. If an error occurs, be sure you are logged in.',
        configuration_panel_enable_ooev_sync: 'Enable <a href="http://www.oeev-hordes.com/" target="_blank">OOEV</a> sync',
        configuration_panel_enable_ooev_sync_tooltip: 'Add the possibility to sync with Où en êtes-vous ?. If an error occurs, be sure you are logged in.',
        configuration_panel_save_button: 'Save',
        external_tools_bar_update: 'Update external tools'
    }
};


/**
 * Die2Nite Enhancer
 */
var D2NE = (function() {
    var self = {};

    var LOCAL_STORAGE_D2NE_CONFIGURATION_KEY = 'd2ne_configuration';

    /**
     * The default configuration.
     */
    var _default_configuration = {
        // Set to true to enable binds
        enable_shortcuts: true,
        // Longest elapsed time between two binds (ms)
        bind_elapsed_time_limit: 1000,
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

        // Set to true to hide the guides
        hide_guides: true,

        // Set to true to hide the RP
        hide_rp_content: true,

        // Sync with external tools
        external_tools: {
            // Set to true to enable BigBroth'Hordes (http://bbh.fred26.fr/)
            enable_bbh_sync: false,
            // Set to true to enable Où en êtes-vous ? (http://www.oeev-hordes.com/)
            enable_ooev_sync: false,
        }
    };

    /**
     * The loaded configuration.
     */
    var _configuration = null;

    /**
     * Load the configuration by merging the one found in the local storage (if
     * any) into the default one.
     */
    var _load_configuration = function() {
        var saved_configuration = localStorage[LOCAL_STORAGE_D2NE_CONFIGURATION_KEY];

        if (js.is_defined(saved_configuration)) {
            _configuration = js.merge(_default_configuration, JSON.parse(saved_configuration));
        } else {
            _configuration = _default_configuration;
        }
    };

    /**
     * Save the configuration found in the configuration panel into the local
     * storage.
     */
    var _save_configuration = function() {
        _configuration.enable_shortcuts = document.getElementById('d2ne_configuration_enable_shortcuts').checked;
        _configuration.hide_hero_adds = document.getElementById('d2ne_configuration_hide_hero_adds').checked;
        _configuration.highlight_ap = document.getElementById('d2ne_configuration_highlight_ap').checked;
        _configuration.hide_help = document.getElementById('d2ne_configuration_hide_help').checked;
        _configuration.hide_twinoid_bar = document.getElementById('d2ne_configuration_hide_twinoid_bar').checked;
        _configuration.hide_footer = document.getElementById('d2ne_configuration_hide_footer').checked;
        _configuration.hide_pegi = document.getElementById('d2ne_configuration_hide_pegi').checked;
        _configuration.hide_rookie_mode = document.getElementById('d2ne_configuration_hide_rookie_mode').checked;
        _configuration.hide_guides = document.getElementById('d2ne_configuration_hide_guides').checked;
        _configuration.hide_rp_content = document.getElementById('d2ne_configuration_hide_rp_content').checked;
        _configuration.external_tools.enable_bbh_sync = document.getElementById('d2ne_configuration_enable_bbh_sync').checked;
        _configuration.external_tools.enable_ooev_sync = document.getElementById('d2ne_configuration_enable_ooev_sync').checked;

        localStorage[LOCAL_STORAGE_D2NE_CONFIGURATION_KEY] = JSON.stringify(_configuration);
    }

    /**
     * The script strings.
     */
    var _i18n = null;

    var _load_internationalisation = function() {
        var language = d2n.get_website_language();

        _i18n = i18n[language];
    };

    /**
     * The available extern tools
     */
    var _external_tools = {
        bbh: {
            update: function(callback_success, callback_failure) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'http://bbh.fred26.fr/',
                    data: 'action=force_maj',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    onload: function(response) {
                        // if response is too short, it is incomplete because
                        // the user is not logged
                        if (response.responseText.length < 20000) {
                            return callback_failure();
                        }
                        return callback_success();
                    },
                    onerror: function(response) {
                        return callback_failure();
                    }
                });
            }
        },

        ooev: {
            update: function(callback_success, callback_failure) {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'http://www.oeev-hordes.com/',
                    data: 'key=c11d21a87965a867af6b1c33f18472cc4f40f3&mode=json',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    onload: function(response) {
                        if (response.responseText !== '{ "response": "Site mis à jour" }') {
                            return callback_failure();
                        }
                        return callback_success();
                    },
                    onerror: function(response) {
                        return callback_failure();
                    }
                });
            }
        }
    };

    /**
     * Update the external tools
     */
    var _update_tools = function(tools_number) {
        var tools_updated = 0;
        var tools_update_aborted = 0;

        var images = document.querySelectorAll('#d2ne_external_tools_bar a img');

        var show_calim = function() {
            images[0].style.display = 'inline';
            images[1].style.display = 'none';
            images[2].style.display = 'none';
            images[3].style.display = 'none';
        }

        var show_loading_wheel = function() {
            images[0].style.display = 'none';
            images[1].style.display = 'inline';
            images[2].style.display = 'none';
            images[3].style.display = 'none';
        }

        var show_smile = function() {
            images[0].style.display = 'none';
            images[1].style.display = 'none';
            images[2].style.display = 'inline';
            images[3].style.display = 'none';
        }

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

        for (var tool in _configuration.external_tools) {
            // if tool isn't enabled, skip it
            if (!(_configuration.external_tools[tool])) {
                continue;
            }

            // else update it
            var tool_name = tool.split('_')[1].split('_')[0];
            _external_tools[tool_name].update(function(response) {
                tools_updated += 1;
                handle_tool_update();
            }, function(response) {
                tools_update_aborted += 1;
                handle_tool_update();
            });
        }
    };

    /**
     * Load a the external tools
     */
    var _external_tools_loaded = false; // set to true when loaded
    var _load_external_tools = function() {
        // if already loaded, abort
        if (_external_tools_loaded) {
            return;
        }

        // this function needs the window.location.hash var
        if (window.location.hash == '') {
            return setTimeout(function() { _load_external_tools(); }, 50);
        }

        // if not any tool is enabled, abort
        var tools_number = 0;
        for (var key in _configuration.external_tools) {
            tools_number += (_configuration.external_tools[key]) ? 1 : 0;
        }
        if (tools_number < 1) {
            return;
        }

        // if not in city or outside, abort
        if (!(d2n.is_in_city() || d2n.is_outside())) {
            return;
        }

        js.wait_for_id('main', function(node) {
            // Create and inject external tools bar style
            js.injectCSS(
                '#d2ne_external_tools_bar {' +
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
                '#d2ne_external_tools_bar a.button {' +
                    'margin-right: auto;' +
                    'margin-left: auto;' +
                '}' +
                '#d2ne_external_tools_bar span {' +
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
                '#d2ne_external_tools_bar a img {' +
                    'vertical-align: middle;' +
                    'margin-right: 4px;' +
                '}' +
                '#gameLayout td.sidePanel {' +
                    'top: 54px;' +
                    'position: relative;' +
                '}' +
                '#main2 {' +
                    'padding-bottom: 70px;' +
                '}'
            );

            // Create external tools bar
            var external_tools_bar_div = document.createElement('div');
            external_tools_bar_div.id = 'd2ne_external_tools_bar';
            external_tools_bar_div.innerHTML =
                '<a href="javascript:void(0)" id="d2ne_external_tools_bar_update" class="button">' +
                '<img src="/gfx/forum/smiley/h_calim.gif" width="19px" height="19px"><img src="/gfx/design/loading.gif" width="19px" height="19px" style="display: none;"><img src="/gfx/forum/smiley/h_smile.gif" width="19px" height="19px" style="display:none;"><img src="/gfx/forum/smiley/h_death.gif" width="19px" height="19px" style="display:none;"></span>' +
                _i18n.external_tools_bar_update + '</a>';

            // Insert external tools bar
            node.insertBefore(external_tools_bar_div, node.firstChild);

            // Set the update behaviour on click
            document.getElementById('d2ne_external_tools_bar_update').addEventListener('click', function(event) {
                _update_tools(tools_number);
            }, true);

            // Hide toolbar if click on Gazette/Soul/Help (because it is
            // positionned as absolute and contained in a high-level div)
            var links = document.querySelectorAll('a.mainButton + a');
            for (var i = 0, length = links.length; i < length; ++i) {
                links[i].addEventListener('click', function() {
                    var remove = function() {
                        if (d2n.is_in_city() || d2n.is_outside()) {
                            return setTimeout(function() {
                                remove();
                            }, 50);
                        }
                        js.remove_element(external_tools_bar_div);
                    };
                    remove();
                }, true);
            }

            _external_tools_loaded = true;
        });
    };

    /**
     * Return a HTML string of an image displaying a help popup with the given
     * message.
     */
    var _tooltip = function(message)
    {
        // defaut empty message
        message = (js.is_defined(message)) ? message : '';

        return '<a href="javascript:void(0)" tooltip="' + message + '" class="d2n_tooltip"><img src="' + _i18n.help_image_url + '" alt="" /></a>';
    }

    /**
     * Create the configuration panel.
     */
    var _load_configuration_panel = function() {
        js.wait_for_id('main', function(node) {
            // Create and inject panel style
            js.injectCSS(
                '#d2ne_configuration_panel {' +
                    'margin-top:6px;' +
                    'position:absolute;' +
                    'margin-left:44px;' +
                    'z-index:9;' +
                    'padding-left:5px;' +
                    'padding-right:5px;' +
                    'background-color:#5c2b20;' +
                    'outline:1px solid #000000;' +
                    'border:1px solid #f0d79e;' +
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
                '#d2ne_configuration_panel p {' +
                    'margin: 0px;' +
                    'padding: 0px;' +
                    'width: 371px;' +
                    'margin-bottom: 4px;' +
                    'font-size: 9pt;' +
                    'line-height: 11pt;' +
                    'text-align: justify;' +
                '}' +
                '#d2ne_configuration_panel p:first-of-type {' +
                    'border-bottom: 1px dashed #ddab76;' +
                    'padding-bottom: 4px;' +
                '}' +
                '#d2ne_configuration_panel table {' +
                    'margin: 0 auto;' +
                '}' +
                '#d2ne_configuration_panel p:last-of-type {' +
                    'text-align: right;' +
                    'border-top: 1px dashed #ddab76;' +
                    'padding-top: 4px;' +
                '}' +
                '#d2ne_configuration_panel a.button {' +
                    'width: auto;' +
                    'margin: 3px 0 3px 4px;' +
                    'text-align: center;' +
                    'padding: 0;' +
                '}' +
                '#d2ne_configuration_panel table tr td:nth-child(2) {' +
                    'padding-right: 10px;' +
                    'border-right: 1px dotted rgba(221, 171, 118, 0.5);' +
                '}' +
                '#d2ne_configuration_panel table tr td:nth-child(3) {' +
                    'padding-left: 5px;' +
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

            // Create panel
            var config_panel_div = document.createElement('div');
            config_panel_div.id = 'd2ne_configuration_panel';
            config_panel_div.innerHTML =
                '<h1><img src="/gfx/forum/smiley/h_city_up.gif" alt=""><span style="display:none"> ' + _i18n.configuration_panel_title + '</span></h1>' +
                '<div style="display:none">' +
                '<p>' + _i18n.script_description + '</p>' +
                '<table>' +

                    '<tr><td><input type="checkbox" id="d2ne_configuration_enable_shortcuts" ' + js.check_checkbox(_configuration.enable_shortcuts) + '/><label for="d2ne_configuration_enable_shortcuts">' + _i18n.configuration_panel_enable_shortcuts + '</label></td><td>' + _tooltip(_i18n.configuration_panel_enable_shortcuts_tooltip) + '</td>' +
                    '<td><input type="checkbox" id="d2ne_configuration_hide_hero_adds" ' + js.check_checkbox(_configuration.hide_hero_adds) + '/><label for="d2ne_configuration_hide_hero_adds">' + _i18n.configuration_panel_hide_hero_adds + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_hero_adds_tooltip) + '</td></tr>' +

                    '<tr><td><input type="checkbox" id="d2ne_configuration_highlight_ap" ' + js.check_checkbox(_configuration.highlight_ap) + '/><label for="d2ne_configuration_highlight_ap">' + _i18n.configuration_panel_highlight_ap + '</label></td><td>' + _tooltip(_i18n.configuration_panel_highlight_ap_tooltip) + '</td>' +
                    '<td><input type="checkbox" id="d2ne_configuration_hide_help" ' + js.check_checkbox(_configuration.hide_help) + '/><label for="d2ne_configuration_hide_help">' + _i18n.configuration_panel_hide_help + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_help_tooltip) + '</td></tr>' +

                    '<tr><td><input type="checkbox" id="d2ne_configuration_enable_bbh_sync" ' + js.check_checkbox(_configuration.external_tools.enable_bbh_sync) + '/><label for="d2ne_configuration_enable_bbh_sync">' + _i18n.configuration_panel_enable_bbh_sync + '</label></td><td>' + _tooltip(_i18n.configuration_panel_enable_bbh_sync_tooltip) + '</td>' +
                    '<td><input type="checkbox" id="d2ne_configuration_hide_twinoid_bar" ' + js.check_checkbox(_configuration.hide_twinoid_bar) + '/><label for="d2ne_configuration_hide_twinoid_bar">' + _i18n.configuration_panel_hide_twinoid_bar + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_twinoid_bar_tooltip) + '</td></tr>' +

                    '<tr><td><input type="checkbox" id="d2ne_configuration_enable_ooev_sync" ' + js.check_checkbox(_configuration.external_tools.enable_ooev_sync) + '/><label for="d2ne_configuration_enable_ooev_sync">' + _i18n.configuration_panel_enable_ooev_sync + '</label></td><td>' + _tooltip(_i18n.configuration_panel_enable_ooev_sync_tooltip) + '</td>' +
                    '<td><input type="checkbox" id="d2ne_configuration_hide_footer" ' + js.check_checkbox(_configuration.hide_footer) + '/><label for="d2ne_configuration_hide_footer">' + _i18n.configuration_panel_hide_footer + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_footer_tooltip) + '</td></tr>' +

                    '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_pegi" ' + js.check_checkbox(_configuration.hide_pegi) + '/><label for="d2ne_configuration_hide_pegi">' + _i18n.configuration_panel_hide_pegi + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_pegi_tooltip) + '</td></tr>' +

                    '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_rookie_mode" ' + js.check_checkbox(_configuration.hide_rookie_mode) + '/><label for="d2ne_configuration_hide_rookie_mode">' + _i18n.configuration_panel_hide_rookie_mode + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_rookie_mode_tooltip) + '</td></tr>' +

                    '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_guides" ' + js.check_checkbox(_configuration.hide_guides) + '/><label for="d2ne_configuration_hide_guides">' + _i18n.configuration_panel_hide_guides + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_guides_tooltip) + '</td></tr>' +

                    '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_rp_content" ' + js.check_checkbox(_configuration.hide_rp_content) + '/><label for="d2ne_configuration_hide_rp_content">' + _i18n.configuration_panel_hide_rp_content + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_rp_content_tooltip) + '</td></tr>' +

                    '<tr><td colspan="4"><a href="javascript:void(0)" id="d2ne_configuration_save" class="button">' + _i18n.configuration_panel_save_button + '</a></td></tr>' +
                '</table>' +
                '<div class="clear"></div>' +
                '<p><a href="' + PROJECT_PAGE + '" target="_blank">' + SCRIPT_NAME +' v' + SCRIPT_VERSION + '</a></p>' +
                '</div>';

            // Insert panel
            node.insertBefore(config_panel_div, main.firstChild);

            // Save and reload page when clicking on the save button
            document.getElementById('d2ne_configuration_save').addEventListener('click', function(event) {
                _save_configuration();
                js.reload();
            }, true);

            // Show/Hide config panel cache
            var _config_panel_cache = document.getElementById('d2ne_configuration_panel');
            var _config_panel_toggled_elements_cache = document.querySelectorAll('#d2ne_configuration_panel > h1 > span, #d2ne_configuration_panel > div');
            var _config_panel_toggled_elements_cache_length = _config_panel_toggled_elements_cache.length;

            // Show panel on hover
            config_panel_div.addEventListener('mouseover', function(event) {
                _config_panel_cache.style['z-index'] = '11'; // This fix is needed for the spanish version, as the hero adds has a z-index of 10
                for (var i = 0; i < _config_panel_toggled_elements_cache_length; ++i) {
                    _config_panel_toggled_elements_cache[i].style.display = 'inline';
                }
            }, true);

            // Hide panel on mouse out
            config_panel_div.addEventListener('mouseout', function(event) {
                for (var i = 0; i < _config_panel_toggled_elements_cache_length; ++i) {
                    _config_panel_toggled_elements_cache[i].style.display = 'none';
                }
                _config_panel_cache.style['z-index'] = '9'; // See previous function comment
            }, true);
        });
    };

    /**
     * All features
     */
    var _features = {

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

            var _tid_cache = document.getElementById('tid_bar');
            var _tid_hidden = true;
            var _tid_side_panels = document.getElementsByClassName('tid_sidePanel');
            var _tid_side_panels_length = _tid_side_panels.length;

            var _show_tid = function() {
                _tid_cache.style.display = 'block';
                _tid_hidden = false;
            };

            var _hide_tid = function() {
                _tid_cache.style.display = 'none';
                _tid_hidden = true;
            };

            document.body.addEventListener('mousemove', function(event) {
                // if on the top of the screen, display the bar
                if (_tid_hidden && event.clientY <= 5) {
                    _show_tid();
                }
                // if not on the top of the screen, hide the bar if the
                // lateral panels are not visible
                else if (!_tid_hidden && event.clientY > 32) {
                    for (var i = 0; i < _tid_side_panels_length; ++i) {
                        var style = getComputedStyle(_tid_side_panels[i]);

                        if (style['visibility'] === 'visible') {
                            return;
                        }
                    }
                    _hide_tid();
                }
            }, true);
        },

        ////
        enable_shortcuts: function() {
            js.keydown_event(function(keycode, previous_keycode) {
                if (previous_keycode !== _configuration.go_bind) {
                    return;
                }
                if (d2n.is_outside()) { // abort if outside
                    return;
                }
                for (var bind in _configuration.binds) {
                    if (_configuration.binds[bind] === keycode) {
                        return d2n.go_to_city_page(bind);
                    }
                }
            });
        },

        ////
        hide_hero_adds: function() {
            js.injectCSS(
                '.heroMode, #ghostHeroAd, #heroContainer, .promoBt, .sondageBg {' +
                'display: none;' +
                '}'
            );
        },

        ////
        highlight_ap: function() {
            js.wait_for_id('movesCounter', function(node) {
                var highlight = function() {
                    var ap = d2n.get_number_of_ap();
                    var colors = [
                        'ff0000', // 0 AP
                        'ff4700', // 1 AP
                        'ff8e00', // 2 AP
                        'ffd500', // 3 AP
                        'e3ff00', // 4 AP
                        '9cff00', // 5 AP
                        '55ff00', // 6 AP
                        '00ff00', // 7 AP
                        '00ff00'  // 8 AP
                    ];

                    js.injectCSS(
                        '#movesCounter {' +
                            'border: 1px solid #' + colors[ap] + ' !important;' +
                        '}'
                    );
                };

                // Highlight at load
                highlight();

                // Change color if AP changes
                var observer = new MutationObserver(function(mutations) {
                    highlight();
                });
                observer.observe(node, {childList: true});
            });
        },

        ////
        hide_help: function() {
            js.injectCSS(
                '#mapTips, #ghost_pages .help {' +
                'display: none' +
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
        hide_guides: function() {
            js.injectCSS(
                '.helpLink {' +
                'display: none;' +
                '}' +
                '#generic_section > div > em:last-of-type {' +
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
        }
    };

    /**
     * Load the script features.
     */
    var _load_features = function() {
        // Browse all features, and check if they have to be activated
        for (var feature in _features) {
            if (_configuration[feature] === true) {
                (_features[feature])();
            }
        }
    }

    /**
     * Set up the script.
     */
    self.init = function() {
        _load_configuration();
        _load_internationalisation();
        _load_features();
        _load_external_tools(); // only if at least one is enabled
        _load_configuration_panel(); // defer loading until #main is found
    };

    return self;
})(); // !D2NE


/**
 * Die2Nite helpers
 */
var d2n = (function() {
    var self = {};

    var _pages_url = {
        overview: 'city/enter',
        home: 'home',
        well: 'city/well',
        bank: 'city/bank',
        citizens: 'city/co',
        buildings: 'city/buildings',
        doors: 'city/door',
        upgrades: 'city/upgrades',
        tower: 'city/tower',
        refine: 'city/refine',
        guard: 'city/guard'
    };

    /**
     * Check if the player is in the city. Return false if the user is in the city
     * but on the forum.
     * @return bool true if inside the city, false otherwise
     */
    self.is_in_city = function()
    {
        return js.match_regex(
            window.location.hash,
            '^#city'
        );
    };

    /**
     * Check if the given city page is loaded.
     * @param string page The page to check (a key from _pages_url)
     * @return string true if on the selected city page
     */
    self.is_on_city_page = function(page)
    {
        return js.match_regex(
            window.location.hash,
            '^#city\\/enter\\?go=' + _pages_url[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
        );
    };

    /**
     * Load a specific city page.
     * @param string page The page to go (a key from _pages_url)
     */
    self.go_to_city_page = function(page)
    {
        var sk = self.get_sk();
        var page_url = _pages_url[page];

        // if already on the page, abort
        if (self.is_on_city_page(page)) {
            return;
        }

        if (self.is_on_forum()) { // if on the forum, redirect to the desired page
            js.redirect('/#city/enter?go=' + page_url + ';sk=' + sk);
        } else { // else just download the content with an ajax request
            js.injectJS('js.XmlHttp.get(\'' + page_url + '?sk=' + sk + '\');');
        }
    };

    /**
     * Return the sk (session/secret key?), return null if nothing can be found.
     * @return string The key
     * @return null if an error occurs
     */
    self.get_sk = function()
    {
        var el = document.querySelector('#sites > ul > li > a.link');

        if (js.is_defined(el) && js.is_defined(el.href)) {
            return el.href.split('=')[2];
        }
        return null;
    };

    /**
     * Give the website language (specific to D2N/Hordes). Return 'en' by
     * default.
     * @return string The language of the current page ('en' / 'fr')
     * @return string 'en' if no corresponding language can be found
     */
    self.get_website_language = function() {
        var websites_language = {
            'www.die2nite.com': 'en',
            'www.hordes.fr': 'fr',
            'www.zombinoia.com': 'es',
            'www.dieverdammten.de': 'de'
        }
        var hostname = window.location.hostname;

        if (js.is_defined(hostname) &&
            js.is_defined(websites_language[hostname])) {
            return websites_language[hostname];
        }

        return 'en';
    };

    /**
     * Give the number of remaining AP. The div 'movesCounter' must be loaded.
     * @return integer The number of AP
     * @return null if an error occurs
     */
    self.get_number_of_ap = function() {
        var el = document.querySelector('#movesCounter > div');

        if (js.is_defined(el)) {
            return el.innerHTML.split('>')[1].split('<')[0];
        }
        return null;
    }

    /**
     * Check if the player is on the forum.
     * @return bool true if on the forum, false otherwise
     */
    self.is_on_forum = function() {
        return (window.location.pathname === '/tid/forum');
    };

    /**
     * Check if the player is outside the city. Return false if the user is
     * outside but on the forum.
     * @return string true if outside, false otherwise
     */
    self.is_outside = function()
    {
        return js.match_regex(
            window.location.hash,
            '^#outside\\?(?:go=outside\\/refresh;)?sk=[a-z0-9]{5}$'
        );
    };

    return self;
})(); // !die2nite helpers


/**
 * Generic JavaScript helpers
 */
var js = (function() {
    var self = {};

    /**
     * Check if a given variable is defined and is not null.
     * @param mixed variable The variable to check
     * @return bool true if the variable is defined and is not null, otherwise
     * false
     */
    self.is_defined = function(variable)
    {
        return (typeof variable !== 'undefined' && variable !== null);
    }

    /**
     * Catch a keydown event (abort if the cursor is in an input field). Call
     * the callback `callback` with the current keycode and the last one (if it
     * exists).
     * @param callback callback The function to call, should look like the
     * following prototype: `function(keycode, previous_keycode){};`.
     * previous_keycode will be null if it doesn't exists.
     */
    self.keydown_event = function(callback, time_limit)
    {
        // defaut 1000ms between two key strokes
        time_limit = (self.is_defined(time_limit)) ? time_limit : 1000;

        document.addEventListener('keydown', function(event) {
            // Cancel event if the cursor is in an input field or textarea
            if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') {
                return;
            }

            // Cancel event if elapsed time is too long between two key strokes
            if (event.timeStamp - _keydown_event.previous_keycode_timestamp > time_limit) {
                _keydown_event.previous_keycode = null;
            }

            // Invoke callback
            callback(event.keyCode, _keydown_event.previous_keycode);

            // Save keycode
            _keydown_event.previous_keycode = event.keyCode;
            _keydown_event.previous_keycode_timestamp = event.timeStamp;
        }, true);
    }
    var _keydown_event = {
        previous_keycode: 0,
        previous_keycode_timestamp: 0,
    };

    /**
     * Inject CSS code in the page context.
     * @param string code The CSS code to inject
     */
    self.injectCSS = function(code)
    {
        var encapsulated_css = document.createElement('style');
        encapsulated_css.type = 'text/css';

        encapsulated_css.innerHTML = code;

        document.getElementsByTagName('head')[0].appendChild(encapsulated_css);
    }

    /**
     * Inject and execute JavaScript code in the page context.
     * @link http://stackoverflow.com/a/14901197/1071486
     * @param string/callback code The JS code to inject
     */
    self.injectJS = function(code)
    {
        var encapsulated_js = document.createElement('script');
        encapsulated_js.type = 'text/javascript';

        if (typeof code === 'function') {
            code = '(' + code + ')();';
        }
        encapsulated_js.textContent = code;

        document.body.appendChild(encapsulated_js);
    };

    /**
     * Remove an DOM node.
     * @link http://stackoverflow.com/a/14782/1071486
     * @param DOMNode node The DOM node to delete
     */
    self.remove_element = function(node) {
        node.parentNode.removeChild(node);
    };

    /*
     * Recursively merge properties of n objects. The first object properties
     * will be erased by the following one's.
     * @link http://stackoverflow.com/a/8625261/1071486
     * @param object... Some object. to merge.
     * @return object A new merged object
     */
    self.merge = function() {
        var obj = {};
        var il = arguments.length;
        var key;

        if (il === 0) {
            return obj;
        }
        for (var i = 0; i < il; ++i) {
            for (key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    obj[key] = arguments[i][key];
                }
            }
        }

        return obj;
    };

    /**
     * Return a string containig either 'checked' or an empty string, depending
     * of the value of $test
     * @return string
     */
    self.check_checkbox = function(test) {
        if (self.is_defined(test) && test === true) {
            return 'checked';
        }
        return '';
    };

    /**
     * Execute a callback when a node with the given $id is found.
     * @param string id The id to search
     * @param callback callback The function to call when a result is found
     */
    self.wait_for_id = function(id, callback) {
        var el;

        if (js.is_defined(el = document.getElementById(id))) {
            return callback(el);
        }
        setTimeout(function() {
            self.wait_for_id(id, callback);
        }, 50);
    };

    /**
     * Redirect to the given url.
     * @param string url The url to redirect to
     */
    self.redirect = function(url) {
        window.location.href = url;
    };

    /**
     * Reload the current page
     */
    self.reload = function() {
        location.reload();
    }

    /**
     * Instanciate a Regex object and test to see if the given string matches
     * it.
     * @param string The string to test
     * @param string/RegExp The regex to match the string with
     * @return bool true if the regex matches the string, false otherwise
     */
    self.match_regex = function(string, regex) {
        var r;

        if (regex instanceof RegExp) {
            r = regex;
        } else {
            r = new RegExp(regex);
        }

        return r.test(string);
    }

    /**
     * Execute a callback with the first node matching the given selector.
     * @param string selector The selector to execute
     * @param callback callback The function to call when a result is found
     */
    self.wait_for_selector = function(selector, callback) {
        var el;

        if (js.is_defined(el = document.querySelector(selector))) {
            return callback(el);
        }
        setTimeout(function() {
            self.wait_for_selector(selector, callback);
        }, 50);
    };

    return self;
})(); // !generic javascript helpers


D2NE.init();

})();
