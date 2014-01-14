// ==UserScript==
//
// You need Google Chrome 13+ or Mozilla Firefox with Greasemonkey 0.9.8+ to use
// this script.
//
// @name __NAME__
// @version __VERSION__
// @description __DESCRIPTION__
// @author __AUTHOR_NAME__ <__AUTHOR_EMAIL__>
// @license __LICENSE__ __LICENSE_URL__
// @icon __USERSCRIPT_ICON__
// @downloadURL __USERSCRIPT_DOWNLOAD_URL__
// @updateURL __USERSCRIPT_DOWNLOAD_URL__
//
// @match http://__MATCHING_URL_1__/*
// @match http://__MATCHING_URL_2__/*
// @match http://__MATCHING_URL_3__/*
// @match http://__MATCHING_URL_4__/*
//
// @grant GM_xmlhttpRequest
// @match http://__CROSS_ORIGIN_XHR_PERMISSION_1__/*
// @exclude http://__CROSS_ORIGIN_XHR_PERMISSION_1__/*
// @match http://__CROSS_ORIGIN_XHR_PERMISSION_2__/*
// @exclude http://__CROSS_ORIGIN_XHR_PERMISSION_2__/*
//
// ==/UserScript==

;(function(undefined) {

"use strict";


/**
 * Script informations
 */
var SCRIPT_NAME = '__NAME__';
var SCRIPT_VERSION = '__VERSION__';
var PROJECT_PAGE = '__PROJECT_WEBSITE__';


var LOCAL_STORAGE_PREFIX = 'extensions.d2ne';


/**
 * Internationalisation
 */
var i18n = {
    en: {
        help_image_url: '/gfx/loc/en/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Settings',
        configuration_panel_script_description: 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.',
        configuration_panel_enable_shortcuts: 'Enable shortcuts',
        configuration_panel_enable_shortcuts_tooltip: 'Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).',
        configuration_panel_hide_hero_adds: 'Hide hero adds',
        configuration_panel_hide_hero_adds_tooltip: 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.',
        configuration_panel_highlight_ap: 'Highlight AP',
        configuration_panel_highlight_ap_tooltip: 'Add a border with a specific color (from red to green) in function of the remaining number of action point.',
        configuration_panel_hide_help: 'Hide help',
        configuration_panel_hide_help_tooltip: 'Hide all the helps in the interface.',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen. Put your mouse near the top of the screen to show it again.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI logo',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI logo at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content.',
        configuration_panel_enable_bbh_sync: 'Enable BBH sync',
        configuration_panel_enable_bbh_sync_tooltip: 'Add the possibility to sync with BigBroth\'Hordes.',
        configuration_panel_enable_oeev_sync: 'Enable OEEV sync',
        configuration_panel_enable_oeev_sync_tooltip: 'Add the possibility to sync with Où en êtes-vous ?',
        configuration_panel_enable_construction_max_ap: 'Use max AP in constructions',
        configuration_panel_enable_construction_max_ap_tooltip: 'While in the construction page, use your actual number of AP instead of the default 1 AP.',
        configuration_panel_hide_completed_constructions: 'Hide completed constructions',
        configuration_panel_hide_completed_constructions_tooltip: 'While in the construction page, hide all the completed ones.',
        configuration_panel_enable_hero_bar_stat: 'Enable hero bar stat',
        configuration_panel_enable_hero_bar_stat_tooltip: 'On soul page, enable days stat on the hero bar.',
        configuration_panel_save_button: 'Save',
        external_tools_bar_update: 'Update external tools'
    },

    fr: {
        help_image_url: '/gfx/loc/fr/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Paramètres',
        configuration_panel_script_description: 'Die2Nite Enhancer vous permet d\'améliorer votre expérience de jeu, toutes les fonctionalités peuvent être controlées depuis ce panneau de configuration.',
        configuration_panel_enable_shortcuts: 'Activer les raccourcis',
        configuration_panel_enable_shortcuts_tooltip: 'Active des raccourcis pour accéder rapidement aux places importantes en ville (e.g.: la banque, les portes).',
        configuration_panel_hide_hero_adds: 'Cacher les pubs pour le mode héros',
        configuration_panel_hide_hero_adds_tooltip: 'Cache les pubs pour le mode héros sur tout le site. C\'est pratique si vous êtes déjà héros ou si vous ne comptez pas le devenir.',
        configuration_panel_highlight_ap: 'Colorer les PA',
        configuration_panel_highlight_ap_tooltip: 'Ajoute une bordure avec une couleur spécifique (du rouge au vert) en fonction du nombre de PA restant.',
        configuration_panel_hide_help: 'Cacher les aides',
        configuration_panel_hide_help_tooltip: 'Cache les aides de jeu dans toute l\'interface.',
        configuration_panel_hide_twinoid_bar: 'Cacher la barre Twinoid',
        configuration_panel_hide_twinoid_bar_tooltip: 'Cache la barre Twinoid en haut de l\'écran. Rapprochez votre souris en haut de l\'écran pour l\'afficher à nouveau.',
        configuration_panel_hide_footer: 'Cacher le bas de page',
        configuration_panel_hide_footer_tooltip: 'Cache le bas de page contenant des informations à propos des autres jeux de Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Cacher le logo PEGI',
        configuration_panel_hide_pegi_tooltip: 'Cache le logo PEGI en bas de page',
        configuration_panel_hide_rookie_mode: 'Cacher le mode apprentissage',
        configuration_panel_hide_rookie_mode_tooltip: 'Cache tous les liens pour activer le mode apprentissage.',
        configuration_panel_hide_rp_content: 'Cacher le contenu RP',
        configuration_panel_hide_rp_content_tooltip: 'Cache le contenu RP (Role-Play).',
        configuration_panel_enable_bbh_sync: 'Activer la sync. BBH',
        configuration_panel_enable_bbh_sync_tooltip: 'Ajoute la possibilité de synchroniser avec BigBroth\'Hordes.',
        configuration_panel_enable_oeev_sync: 'Activer la sync. OEEV',
        configuration_panel_enable_oeev_sync_tooltip: 'Ajoute la possibilité de synchroniser avec Où en êtes-vous ?.',
        configuration_panel_enable_construction_max_ap: 'Constructions PA max',
        configuration_panel_enable_construction_max_ap_tooltip: 'Utilise le maximum de PA disponible pour les constructions au lieu de 1 par défault.',
        configuration_panel_hide_completed_constructions: 'Cacher constructions finies',
        configuration_panel_hide_completed_constructions_tooltip: 'Cache les constructions finies.',
        configuration_panel_enable_hero_bar_stat: 'Activer stats barre héro',
        configuration_panel_enable_hero_bar_stat_tooltip: 'Sur la page d\'âme, active le pourcentage de la barre héros.',
        configuration_panel_save_button: 'Sauvegarder',
        external_tools_bar_update: 'Mettre à jour les outils externes'
    },

    es: {
        help_image_url: '/gfx/loc/es/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Settings',
        configuration_panel_script_description: 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.',
        configuration_panel_enable_shortcuts: 'Enable shortcuts',
        configuration_panel_enable_shortcuts_tooltip: 'Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).',
        configuration_panel_hide_hero_adds: 'Hide hero adds',
        configuration_panel_hide_hero_adds_tooltip: 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.',
        configuration_panel_highlight_ap: 'Highlight AP',
        configuration_panel_highlight_ap_tooltip: 'Add a border with a specific color (from red to green) in function of the remaining number of action point.',
        configuration_panel_hide_help: 'Hide help',
        configuration_panel_hide_help_tooltip: 'Hide all the helps in the interface.',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen. Put your mouse near the top of the screen to show it again.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content.',
        configuration_panel_enable_bbh_sync: 'Enable BBH sync',
        configuration_panel_enable_bbh_sync_tooltip: 'Add the possibility to sync with BigBroth\'Hordes.',
        configuration_panel_enable_oeev_sync: 'Enable OEEV sync',
        configuration_panel_enable_oeev_sync_tooltip: 'Add the possibility to sync with Où en êtes-vous ?',
        configuration_panel_enable_construction_max_ap: 'Use max AP in constructions',
        configuration_panel_enable_construction_max_ap_tooltip: 'While in the construction page, use your actual number of AP instead of the default 1 AP.',
        configuration_panel_hide_completed_constructions: 'Hide completed constructions',
        configuration_panel_hide_completed_constructions_tooltip: 'While in the construction page, hide all the completed ones.',
        configuration_panel_enable_hero_bar_stat: 'Enable hero bar stat',
        configuration_panel_enable_hero_bar_stat_tooltip: 'On soul page, enable days stat on the hero bar.',
        configuration_panel_save_button: 'Save',
        external_tools_bar_update: 'Update external tools'
    },

    de: {
        help_image_url: '/gfx/loc/de/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Settings',
        configuration_panel_script_description: 'Die2Nite Enhancer allows you to enhance your game experience, every features can be controlled from this panel.',
        configuration_panel_enable_shortcuts: 'Enable shortcuts',
        configuration_panel_enable_shortcuts_tooltip: 'Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).',
        configuration_panel_hide_hero_adds: 'Hide hero adds',
        configuration_panel_hide_hero_adds_tooltip: 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.',
        configuration_panel_highlight_ap: 'Highlight AP',
        configuration_panel_highlight_ap_tooltip: 'Add a border with a specific color (from red to green) in function of the remaining number of action point.',
        configuration_panel_hide_help: 'Hide help',
        configuration_panel_hide_help_tooltip: 'Hide all the helps in the interface.',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen. Put your mouse near the top of the screen to show it again.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content.',
        configuration_panel_enable_bbh_sync: 'Enable BBH sync',
        configuration_panel_enable_bbh_sync_tooltip: 'Add the possibility to sync with BigBroth\'Hordes.',
        configuration_panel_enable_oeev_sync: 'Enable OEEV sync',
        configuration_panel_enable_oeev_sync_tooltip: 'Add the possibility to sync with Où en êtes-vous ?',
        configuration_panel_enable_construction_max_ap: 'Use max AP in constructions',
        configuration_panel_enable_construction_max_ap_tooltip: 'While in the construction page, use your actual number of AP instead of the default 1 AP.',
        configuration_panel_hide_completed_constructions: 'Hide completed constructions',
        configuration_panel_hide_completed_constructions_tooltip: 'While in the construction page, hide all the completed ones.',
        configuration_panel_enable_hero_bar_stat: 'Enable hero bar stat',
        configuration_panel_enable_hero_bar_stat_tooltip: 'On soul page, enable days stat on the hero bar.',
        configuration_panel_save_button: 'Save',
        external_tools_bar_update: 'Update external tools'
    }
};


/**
 * Die2Nite Enhancer
 */
var D2NE = (function() {
    var self = {};

    var LOCAL_STORAGE_D2NE_CONFIGURATION_KEY = LOCAL_STORAGE_PREFIX + '.configuration';

    /**
     * The default configuration.
     */
    var _default_configuration = {
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
        _configuration.hide_rp_content = document.getElementById('d2ne_configuration_hide_rp_content').checked;
        _configuration.external_tools.enable_bbh_sync = document.getElementById('d2ne_configuration_enable_bbh_sync').checked;
        _configuration.external_tools.enable_oeev_sync = document.getElementById('d2ne_configuration_enable_oeev_sync').checked;
        _configuration.enable_construction_max_ap = document.getElementById('d2ne_configuration_enable_construction_max_ap').checked;
        _configuration.hide_completed_constructions = document.getElementById('d2ne_configuration_hide_completed_constructions').checked;
        _configuration.enable_hero_bar_stat = document.getElementById('d2ne_configuration_enable_hero_bar_stat').checked;

        localStorage[LOCAL_STORAGE_D2NE_CONFIGURATION_KEY] = JSON.stringify(_configuration);
    }

    /**
     * Inject the configuration retrieved from the local storage.
     */
    var _inject_configuration = function() {
        document.getElementById('d2ne_configuration_enable_shortcuts').checked = _configuration.enable_shortcuts;
        document.getElementById('d2ne_configuration_hide_hero_adds').checked = _configuration.hide_hero_adds;
        document.getElementById('d2ne_configuration_highlight_ap').checked = _configuration.highlight_ap;
        document.getElementById('d2ne_configuration_hide_help').checked = _configuration.hide_help;
        document.getElementById('d2ne_configuration_hide_twinoid_bar').checked = _configuration.hide_twinoid_bar;
        document.getElementById('d2ne_configuration_hide_footer').checked = _configuration.hide_footer;
        document.getElementById('d2ne_configuration_hide_pegi').checked = _configuration.hide_pegi;
        document.getElementById('d2ne_configuration_hide_rookie_mode').checked = _configuration.hide_rookie_mode;
        document.getElementById('d2ne_configuration_hide_rp_content').checked = _configuration.hide_rp_content;
        document.getElementById('d2ne_configuration_enable_bbh_sync').checked = _configuration.external_tools.enable_bbh_sync;
        document.getElementById('d2ne_configuration_enable_oeev_sync').checked = _configuration.external_tools.enable_oeev_sync;
        document.getElementById('d2ne_configuration_enable_construction_max_ap').checked = _configuration.enable_construction_max_ap;
        document.getElementById('d2ne_configuration_hide_completed_constructions').checked = _configuration.hide_completed_constructions;
        document.getElementById('d2ne_configuration_enable_hero_bar_stat').checked = _configuration.enable_hero_bar_stat;
    };

    /**
     * The script strings.
     */
    var _i18n = null;

    var _load_internationalisation = function() {
        var language = d2n.get_website_language();

        _i18n = i18n[language];
    };

    /**
     * Extern tools
     */
    var _external_tools = {
        oeev: {
            site_id: 22,
            local_storage_key: LOCAL_STORAGE_PREFIX + '.oeev_key',
            configuration_panel_id: 'd2ne_configuration_enable_oeev_sync',
            update: function(callback_success, callback_failure) {
                portability.network_request(
                    'POST',
                    'http://www.oeev-hordes.com/',
                    'key=' + localStorage[_external_tools.oeev.local_storage_key] + '&mode=json',
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
                portability.network_request(
                    'POST',
                    'http://bbh.fred26.fr/',
                    'key=' + localStorage[_external_tools.bbh.local_storage_key] + '&action=force_maj',
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
     * Fetch the external tools private keys.
     */
    var _fetch_tools_private_keys = function() {
        var enable_tool_in_config_panel, tool_info, match;
        var sk = d2n.get_sk(function(sk) {
            for (var tool in _external_tools) {
                tool_info = _external_tools[tool];

                if (!js.is_defined(localStorage[tool_info.local_storage_key])) {
                    portability.network_request('GET',
                        window.location.host + '/disclaimer?id=' + tool_info.site_id + ';sk=' + sk,
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
    };

    /**
     * Update the external tools
     */
    var _update_tools = function(tools_number) {
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

        for (var tool in _configuration.external_tools) {
            // if tool isn't enabled, skip it
            if (!(_configuration.external_tools[tool])) {
                continue;
            }

            var tool_name = tool.split('_')[1].split('_')[0];

            // if key hasn't been found, skip it
            if (!js.is_defined(localStorage[_external_tools[tool_name].local_storage_key])) {
                continue;
            }

            // else update it
            ++tools_number;
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
        var load = function() {
            // if already loaded, abort
            if (_external_tools_loaded) {
                return;
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
                    ["a", { "id": "d2ne_external_tools_bar" },
                        ["a", { "href": "javascript:void(0)", "id": "d2ne_external_tools_bar_update", "class": "button", "onclick": function() { _update_tools(); } },
                            ["img", { "src": "/gfx/forum/smiley/h_calim.gif", "width": "19px", "height": "19px" }],
                            ["img", { "src": "/gfx/design/loading.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            ["img", { "src": "/gfx/forum/smiley/h_smile.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            ["img", { "src": "/gfx/forum/smiley/h_death.gif", "width": "19px", "height": "19px", "style": "display: none;" }],
                            _i18n.external_tools_bar_update
                        ]
                    ]
                , document);

                // Insert external tools bar
                node.insertBefore(external_tools_bar_div, node.firstChild);
                _external_tools_loaded = true;

                // Remove toolbar when leaving the city/outside page
                document.addEventListener('d2n_hashchange', function() {
                    if (!(d2n.is_in_city() || d2n.is_outside())) {
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
    };

    /**
     * Create the configuration panel.
     */
    var _load_configuration_panel = function() {
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
                            ["span", { "style": "display: none;" }, ' ' + _i18n.configuration_panel_title]
                        ],

                        ["div", { "style": "display: none;" },
                            ["table", {},
                                ["tr", {},
                                    ["td", { "colspan": 4 }, _i18n.configuration_panel_script_description]
                                ],

                                // First row
                                ["tr", {},
                                    // Enable shortcuts
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_shortcuts", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_enable_shortcuts" }, _i18n.configuration_panel_enable_shortcuts]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_enable_shortcuts_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide hero adds
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_hero_adds", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_hero_adds" }, _i18n.configuration_panel_hide_hero_adds],
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_hide_hero_adds_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Second row
                                ["tr", {},
                                    // Highlight AP
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_highlight_ap", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_highlight_ap" }, _i18n.configuration_panel_highlight_ap]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_highlight_ap_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide help
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_help", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_help" }, _i18n.configuration_panel_hide_help]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_hide_help_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Third row
                                ["tr", {},
                                    // Enable construction max AP
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_construction_max_ap", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_enable_construction_max_ap" }, _i18n.configuration_panel_enable_construction_max_ap]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_enable_construction_max_ap_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide Twinoid bar
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_twinoid_bar", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_twinoid_bar" }, _i18n.configuration_panel_hide_twinoid_bar]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_hide_twinoid_bar_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Fourth row
                                ["tr", {},
                                    // Hide completed constructions
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_completed_constructions", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_completed_constructions" }, _i18n.configuration_panel_hide_completed_constructions]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_hide_completed_constructions_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide Footer
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_footer", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_footer" }, _i18n.configuration_panel_hide_footer]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_hide_footer_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Fifth row
                                ["tr", {},
                                    // Enable hero bar stat
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_hero_bar_stat", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_enable_hero_bar_stat" }, _i18n.configuration_panel_enable_hero_bar_stat]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_enable_hero_bar_stat_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide PEGI
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_pegi", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_pegi" }, _i18n.configuration_panel_hide_pegi]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_hide_pegi_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Sixth row
                                ["tr", {},
                                    // Enable BBH sync
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_bbh_sync", "type": "checkbox", "disabled": "disabled" }],
                                        ["label", { "for": "d2ne_configuration_enable_bbh_sync" }, _i18n.configuration_panel_enable_bbh_sync]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_enable_bbh_sync_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide rookie mode
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_rookie_mode", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_rookie_mode" }, _i18n.configuration_panel_hide_rookie_mode]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_hide_rookie_mode_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                // Seventh row
                                ["tr", {},
                                    // Enable oeev sync
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_enable_oeev_sync", "type": "checkbox", "disabled": "disabled" }],
                                        ["label", { "for": "d2ne_configuration_enable_oeev_sync" }, _i18n.configuration_panel_enable_oeev_sync]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_enable_oeev_sync_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ],

                                    // Hide RP content
                                    ["td", {},
                                        ["input", { "id": "d2ne_configuration_hide_rp_content", "type": "checkbox" }],
                                        ["label", { "for": "d2ne_configuration_hide_rp_content" }, _i18n.configuration_panel_hide_rp_content]
                                    ],
                                    ["td", {},
                                        ["a", { "class": "d2n_tooltip", "href": "javascript:void(0)", "tooltip": _i18n.configuration_panel_hide_rp_content_tooltip },
                                            ["img", { "src": _i18n.help_image_url, "alt": "" }],
                                        ]
                                    ]
                                ],

                                ["tr", {},
                                    ["td", { "colspan": 4 },
                                        ["a", { "href": "javascript:void(0)", "id": "d2ne_configuration_save", "class": "button",
                                                "onclick": function() { _save_configuration(); js.reload(); } },
                                              _i18n.configuration_panel_save_button]
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
            _inject_configuration();

            // Show/Hide config panel cache
            var _config_panel_cache = document.getElementById('d2ne_configuration_panel');
            var _config_panel_toggled_elements_cache = document.querySelectorAll('#d2ne_configuration_panel > div > h1 > span, #d2ne_configuration_panel > div > div');
            var _config_panel_toggled_elements_cache_length = _config_panel_toggled_elements_cache.length;

            // Show panel on hover
            config_panel_div.addEventListener('mouseover', function() {
                _config_panel_cache.style['z-index'] = '11'; // This fix is needed for the spanish version, as the hero adds has a z-index of 10
                for (var i = 0; i < _config_panel_toggled_elements_cache_length; ++i) {
                    _config_panel_toggled_elements_cache[i].style.display = 'inline';
                }
            }, false);

            // Hide panel on mouse out
            config_panel_div.addEventListener('mouseout', function() {
                for (var i = 0; i < _config_panel_toggled_elements_cache_length; ++i) {
                    _config_panel_toggled_elements_cache[i].style.display = 'none';
                }
                _config_panel_cache.style['z-index'] = '9'; // See previous function comment
            }, false);
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

            js.wait_for_id('tid_bar', function(node) {
                var _tid_cache = node;
                var _tid_hidden = true;
                js.wait_for_selector_all('.tid_sidePanel', function(nodes) {
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
                            var _tid_side_panels = document.getElementsByClassName('tid_sidePanel');
                            var _tid_side_panels_length = _tid_side_panels.length;

                            for (var i = 0; i < _tid_side_panels_length; ++i) {
                                var style = getComputedStyle(_tid_side_panels[i]);

                                if (style['visibility'] === 'visible') {
                                    return;
                                }
                            }
                            _hide_tid();
                        }
                    }, false);
                });
            });
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
                '.heroMode, #ghostHeroAd, #heroContainer, .heroAd, #ghostHeroChoose, .promoBt, .sondageBg {' +
                    'display: none !important;' +
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
                if (!d2n.is_on_city_page('buildings')) {
                    return;
                }

                var ap = d2n.get_number_of_ap();

                js.wait_for_selector('tr.banner.root_wall1', function() {
                    var fields = document.querySelectorAll('div[id^="moreForm_"] form input[type="text"]');
                    var fields_length = fields.length;

                    for (var i = 0; i < fields_length; ++i) {
                        fields[i].value = ap;
                    }
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
                if (!(d2n.is_on_city_page('ghost') || d2n.is_on_city_page('ghost_exp') ||
                      d2n.is_on_page_not_in_city('ghost') || d2n.is_on_page_not_in_city('ghost_exp'))) {
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
                                if (node.innerHTML !== '') {
                                    return setTimeout(function() {
                                        fill_bar();
                                    }, 50);
                                }
                                node.innerHTML = parseInt(percent) + '%';
                            });
                        };
                        fill_bar();
                    });
                });
            }, false);
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
        _load_external_tools(); // only if at least one tool is enabled
        _load_configuration_panel(); // defer loading until #main is found
        _fetch_tools_private_keys();
        d2n.add_custom_events(); // add and fire custom events after initialisation
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
        guard: 'city/guard',
        ghost: 'ghost/user',
        ghost_exp: 'ghost/heroUpgrades'
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
        ) || js.match_regex(
            window.location.hash,
            '^#ghost\\/city\\?go=' + _pages_url[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
        );
    };

    /**
     * Check if the given page is loaded (not in city).
     * @param string page The page to check (a key from _pages_url)
     * @return string true if on the selected page (not in city)
     */
    self.is_on_page_not_in_city = function(page) {
        return js.match_regex(
            window.location.hash,
            '^#ghost\\?go=' + _pages_url[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
        );
    };

    /**
     * Load a specific city page.
     * @param string page The page to go (a key from _pages_url)
     */
    self.go_to_city_page = function(page)
    {
        var sk = self.get_sk(function(sk) {
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
        });
    };

    /**
     * Return the sk (session/secret key?), return null if nothing can be found.
     * @param callback callback The function to call once the sk is fetched
     */
    self.get_sk = function(callback)
    {
        js.wait_for_selector('a.mainButton.newsButton', function(node) {
            var arr = node.href.split('=');
            return callback(arr[arr.length - 1]); // return last element
        });
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

    /**
     * Add custom events on the interface:
     * - to watch the hash in the URL: 'hashchange'
     * - to watch the number of AP: 'apchange'
     */
    self.add_custom_events= function() {
        // Watch for the first hash on page loading
        var watch_for_hash = function() {
            if (window.location.hash === '') {
                return setTimeout(function() { watch_for_hash(); }, 50);
            }

            var event = new CustomEvent(
                "d2n_hashchange", {
                    detail: {
                        hash: window.location.hash
                    },
                    bubbles: true,
                    cancelable: true
                }
            );
            document.dispatchEvent(event);
        };
        watch_for_hash();

        // Watch the hash
        js.injectJS(function() {
            js.BackForward.updateHash = function() {
                // Original MT code
                var n = '#' + js.BackForward.current;
                js.BackForward.lastHash = js.Lib.window.location.hash;
                if(n == js.BackForward.lastHash) return;
                js.Lib.window.location.hash = n;
                js.BackForward.lastHash = js.Lib.window.location.hash;

                // Emit an event when the hash changes
                var event = new CustomEvent(
                    'd2n_hashchange', {
                        detail: {
                            hash: window.location.hash
                        },
                        bubbles: true,
                        cancelable: true
                    }
                );
                document.dispatchEvent(event);
            };
        });

        // Watch the AP
        var observer = new MutationObserver(function(mutations) {
            // Emit an event when the ap changes
            var event = new CustomEvent(
                'd2n_apchange', {
                    detail: {
                        ap: d2n.get_number_of_ap()
                    },
                    bubbles: true,
                    cancelable: true
                }
            );
            document.dispatchEvent(event);
        });
        js.wait_for_id('movesCounter', function(node) {
            observer.observe(node, {childList: true});
        });
    };

    return self;
})(); // !die2nite helpers


/**
 * Portability helpers (on Chrome, GM, Opera, etc...)
 */
var portability = (function() {
    var self = {};

    /**
     * Execute an asynchronous network request.
     * @param string method
     * @param string url
     * @param string data
     * @param JSON headers
     * @param callback onsuccess in case of success
     * @param callback onfailure in case of failure
     * @param Object param An object given as an additional parameter to callbacks
     */
    self.network_request = function(method, url, data, headers, onsuccess, onfailure, param) {

        // Google Chrome script / GreaseMonkey
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            return GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                headers: headers,
                onload: function(r) { onsuccess(r.responseText, param); },
                onerror: function(r) { onfailure(param); }
            });
        }

        // Safari needs to dispatch the request to the global page
        if (typeof safari !== 'undefined') {
            safari.self.addEventListener('message', function(event) {
                switch (event.name) {
                    case 'network_request_succeed':
                        return onsuccess(event.message, param);

                    case 'network_request_failed':
                        return onfailure(param);
                }
            }, false);

            return safari.self.tab.dispatchMessage('do_network_request', {
                method: method,
                url: url,
                data: data,
                headers: headers
            });
        }

        // All other cases
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(method, url, true);
        for (var header in headers) {
            xmlhttp.setRequestHeader(header, headers[header]);
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    return onsuccess(xmlhttp.responseText, param);
                }
                return onfailure(param);
            }
        };
        xmlhttp.send(data);
    };


    return self;
})();


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
     * @param integer time_limit The maximum amount of time (in ms) to wait
     * between two binds.
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
        }, false);
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

        self.wait_for_selector('html > head', function(node) {
            node.appendChild(encapsulated_css);
        });
    }

    /**
     * Inject and execute JavaScript code in the page context.
     * @link http://wiki.greasespot.net/Content_Script_Injection
     * @param string/callback source The JS code to inject
     */
    self.injectJS = function(source)
    {
        // Check for function input.
        if ('function' === typeof source) {
            // Execute this function with no arguments, by adding parentheses.
            // One set around the function, required for valid syntax, and a
            // second empty set calls the surrounded function.
            source = '(' + source + ')();'
        }

        // Create a script node holding this  source code.
        var script = document.createElement('script');
        script.setAttribute('type', 'application/javascript');
        script.textContent = source;

        // Insert the script node into the page, so it will run, and immediately
        // remove it to clean up.
        self.wait_for_selector('html > body', function(node) {
            node.appendChild(script);
            node.removeChild(script);
        });
    };

    /**
     * Remove an DOM node.
     * @link http://stackoverflow.com/a/14782/1071486
     * @param DOMNode node The DOM node to delete
     */
    self.remove_DOM_node = function(node) {
        if (self.is_defined(node)) {
            node.parentNode.removeChild(node);
        }
    };

    /*
     * Recursively merge properties of n objects. The first object properties
     * will be erased by the following one's.
     * @link http://stackoverflow.com/a/8625261/1071486
     * @param object... Some objects to merge.
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

    /**
     * Execute a callback with an array containing all the nodes matching the
     * given selector.
     * @param string selector The selector to execute
     * @param callback callback The function to call when a result is found
     */
    self.wait_for_selector_all = function(selector, callback) {
        var el;

        if (js.is_defined(el = document.querySelectorAll(selector))) {
            return callback(el);
        }
        setTimeout(function() {
            self.wait_for_selector_all(selector, callback);
        }, 50);
    };

    /**
     * Safely insert code through JSON.
     * @link https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion
     */
    jsonToDOM.namespaces = {
        html: "http://www.w3.org/1999/xhtml",
        xul: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    };
    jsonToDOM.defaultNamespace = jsonToDOM.namespaces.html;
    function jsonToDOM(xml, doc, nodes) {
        function namespace(name) {
            var m = /^(?:(.*):)?(.*)$/.exec(name);
            return [jsonToDOM.namespaces[m[1]], m[2]];
        }

        function tag(name, attr) {
            if (Array.isArray(name)) {
                var frag = doc.createDocumentFragment();
                Array.forEach(arguments, function (arg) {
                    if (!Array.isArray(arg[0]))
                        frag.appendChild(tag.apply(null, arg));
                    else
                        arg.forEach(function (arg) {
                            frag.appendChild(tag.apply(null, arg));
                        });
                });
                return frag;
            }

            var args = Array.prototype.slice.call(arguments, 2);
            var vals = namespace(name);
            var elem = doc.createElementNS(vals[0] || jsonToDOM.defaultNamespace,
                                           vals[1]);

            for (var key in attr) {
                var val = attr[key];
                if (nodes && key == "key")
                    nodes[val] = elem;

                vals = namespace(key);
                if (typeof val == "function")
                    elem.addEventListener(key.replace(/^on/, ""), val, false);
                else
                    elem.setAttributeNS(vals[0] || "", vals[1], val);
            }
            args.forEach(function(e) {
                elem.appendChild(typeof e == "object" ? tag.apply(null, e) :
                                 e instanceof Node    ? e : doc.createTextNode(e));
            });
            return elem;
        }
        return tag.apply(null, xml);
    }
    self.jsonToDOM = jsonToDOM;

    return self;
})(); // !generic javascript helpers


D2NE.init();

})();
