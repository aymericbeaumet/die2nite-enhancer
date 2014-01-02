/*
 * You need Google Chrome 4+ or Mozilla Firefox with Greasemonkey 0.9.8+ to use
 * this script.
 */

// ==UserScript==
// @name Die2Nite Enhancer
// @description Enhance your game experience!
// @author Aymeric Beaumet <aymeric@beaumet.me>
// @license zlib/libpng http://opensource.org/licenses/Zlib
// @updateURL https://github.com/abeaumet/die2nite_enhancer/raw/master/die2nite_enhancer.user.js
// @match *://www.die2nite.com/*
// @match *://www.hordes.fr/*
// @match *://www.zombinoia.com/*
// @match *://www.dieverdammten.de/*
// @version 0.0.1
// ==/UserScript==

"use strict";

;(function(undefined) {

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
        configuration_panel_hide_help_tooltip: 'Hide the blue help boxes in the interface',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_guides: 'Hide guides',
        configuration_panel_hide_guides_tooltip: 'Hide all the guides and the help tooltips.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content',
        configuration_panel_save_button: 'Save'
    },

    fr: {
        script_description: 'Die2Nite Enhancer vous permet d\'améliorer votre expérience de jeu, toutes ces fonctionalités peuvent être configurées depuis ce panneau.',
        help_image_url: '/gfx/loc/fr/helpLink.gif',
        configuration_panel_title: 'Die2Nite Enhancer - Paramètres',
        configuration_panel_enable_shortcuts: 'Activer les raccourcis',
        configuration_panel_enable_shortcuts_tooltip: 'Vous permet d\'utiliser des raccourcis pour accéder rapidement aux places importants (e.g.: la banque, les portes).',
        configuration_panel_hide_hero_adds: 'Hide hero adds',
        configuration_panel_hide_hero_adds_tooltip: 'Hide the adds for the hero mode on all the website. Can be useful if you are already hero or don\'t want to be one.',
        configuration_panel_highlight_ap: 'Highlight AP',
        configuration_panel_highlight_ap_tooltip: 'Add a border with a specific color (from red to green) in function of the remaining number of action point.',
        configuration_panel_hide_help: 'Hide help',
        configuration_panel_hide_help_tooltip: 'Hide the blue help boxes in the interface',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_guides: 'Hide guides',
        configuration_panel_hide_guides_tooltip: 'Hide all the guides.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content',
        configuration_panel_save_button: 'Sauvegarder'
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
        configuration_panel_hide_help_tooltip: 'Hide the blue help boxes in the interface',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_guides: 'Hide guides',
        configuration_panel_hide_guides_tooltip: 'Hide all the guides.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content',
        configuration_panel_save_button: 'Save'
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
        configuration_panel_hide_help_tooltip: 'Hide the blue help boxes in the interface',
        configuration_panel_hide_twinoid_bar: 'Hide Twinoid bar',
        configuration_panel_hide_twinoid_bar_tooltip: 'Hide the Twinoid black bar at the top of the screen.',
        configuration_panel_hide_footer: 'Hide footer',
        configuration_panel_hide_footer_tooltip: 'Hide the page footer with informations about other games, Motion Twin, etc...',
        configuration_panel_hide_pegi: 'Hide PEGI',
        configuration_panel_hide_pegi_tooltip: 'Hide the PEGI image at the bottom of each page.',
        configuration_panel_hide_rookie_mode: 'Hide rookie mode',
        configuration_panel_hide_rookie_mode_tooltip: 'Hide all the links to enable the rookie mode.',
        configuration_panel_hide_guides: 'Hide guides',
        configuration_panel_hide_guides_tooltip: 'Hide all the guides.',
        configuration_panel_hide_rp_content: 'Hide RP content',
        configuration_panel_hide_rp_content_tooltip: 'Hide all the RP content',
        configuration_panel_save_button: 'Save'
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
        hide_twinoid_bar: true,

        // Set to true to hide the footer
        hide_footer: true,

        // Set to true to hide the PEGI image at the bottom of each page
        hide_pegi: true,

        // Set to true to hide the rookie mode links
        hide_rookie_mode: true,

        // Set to true to hide the guides
        hide_guides: true,

        // Set to true to hide the RP
        hide_rp_content: true
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

        if (helpers.is_defined(saved_configuration)) {
            _configuration = helpers.merge(_default_configuration, JSON.parse(saved_configuration));
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

        localStorage[LOCAL_STORAGE_D2NE_CONFIGURATION_KEY] = JSON.stringify(_configuration);
    }

    /**
     * The script strings.
     */
    var _i18n = null;

    var _load_internationalisation = function() {
        var language = d2n_helpers.get_website_language();

        _i18n = i18n[language];
    };

    /**
     * Return a HTML string of an image displaying a help popup with the given
     * message.
     */
    var _tooltip = function(message)
    {
        // defaut empty message
        message = (helpers.is_defined(message)) ? message : '';

        return '<a href="#" onclick="return false;" tooltip="' + message + '" class="d2n_tooltip"><img src="' + _i18n.help_image_url + '" alt="" /></a>';
    }

    /**
     * Create the configuration panel.
     */
    var _load_configuration_panel = function() {
        // Create panel
        var config_panel_div = document.createElement('div');
        config_panel_div.id = 'd2ne_configuration_panel';
        config_panel_div.innerHTML =
            '<h1><img src="/gfx/forum/smiley/h_city_up.gif" alt=""><span style="display:none"> ' + _i18n.configuration_panel_title + '</span></h1>' +
            '<div style="display:none">' +
            '<p>' + _i18n.script_description + '</p>' +
            '<table>' +

                '<tr><td><input type="checkbox" id="d2ne_configuration_enable_shortcuts" ' + helpers.check_checkbox(_configuration.enable_shortcuts) + '/><label for="d2ne_configuration_enable_shortcuts">' + _i18n.configuration_panel_enable_shortcuts + '</label></td><td>' + _tooltip(_i18n.configuration_panel_enable_shortcuts_tooltip) + '</td>' +
                '<td><input type="checkbox" id="d2ne_configuration_hide_hero_adds" ' + helpers.check_checkbox(_configuration.hide_hero_adds) + '/><label for="d2ne_configuration_hide_hero_adds">' + _i18n.configuration_panel_hide_hero_adds + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_hero_adds_tooltip) + '</td></tr>' +

                '<tr><td><input type="checkbox" id="d2ne_configuration_highlight_ap" ' + helpers.check_checkbox(_configuration.highlight_ap) + '/><label for="d2ne_configuration_highlight_ap">' + _i18n.configuration_panel_highlight_ap + '</label></td><td>' + _tooltip(_i18n.configuration_panel_highlight_ap_tooltip) + '</td>' +
                '<td><input type="checkbox" id="d2ne_configuration_hide_help" ' + helpers.check_checkbox(_configuration.hide_help) + '/><label for="d2ne_configuration_hide_help">' + _i18n.configuration_panel_hide_help + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_help_tooltip) + '</td></tr>' +

                '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_twinoid_bar" ' + helpers.check_checkbox(_configuration.hide_twinoid_bar) + '/><label for="d2ne_configuration_hide_twinoid_bar">' + _i18n.configuration_panel_hide_twinoid_bar + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_twinoid_bar_tooltip) + '</td></tr>' +

                '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_footer" ' + helpers.check_checkbox(_configuration.hide_footer) + '/><label for="d2ne_configuration_hide_footer">' + _i18n.configuration_panel_hide_footer + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_footer_tooltip) + '</td></tr>' +

                '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_pegi" ' + helpers.check_checkbox(_configuration.hide_pegi) + '/><label for="d2ne_configuration_hide_pegi">' + _i18n.configuration_panel_hide_pegi + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_pegi_tooltip) + '</td></tr>' +

                '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_rookie_mode" ' + helpers.check_checkbox(_configuration.hide_rookie_mode) + '/><label for="d2ne_configuration_hide_rookie_mode">' + _i18n.configuration_panel_hide_rookie_mode + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_rookie_mode_tooltip) + '</td></tr>' +

                '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_guides" ' + helpers.check_checkbox(_configuration.hide_guides) + '/><label for="d2ne_configuration_hide_guides">' + _i18n.configuration_panel_hide_guides + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_guides_tooltip) + '</td></tr>' +

                '<tr><td></td><td></td><td><input type="checkbox" id="d2ne_configuration_hide_rp_content" ' + helpers.check_checkbox(_configuration.hide_rp_content) + '/><label for="d2ne_configuration_hide_rp_content">' + _i18n.configuration_panel_hide_rp_content + '</label></td><td>' + _tooltip(_i18n.configuration_panel_hide_rp_content_tooltip) + '</td></tr>' +

                '<tr><td colspan="4"><a href="#" id="d2ne_configuration_save" class="button">' + _i18n.configuration_panel_save_button + '</a></td></tr>' +
            '</table>' +
            '<div class="clear"></div>' +
            '<p><a href="' + PROJECT_PAGE + '" target="_blank">' + SCRIPT_NAME +' v' + SCRIPT_VERSION + '</a></p>' +
            '</div>';

        // Insert panel
        var main_div = document.getElementById('main');
        main_div.insertBefore(config_panel_div, main.firstChild);

        // Create panel style
        helpers.injectCSS(
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
                'width: 430px;' +
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

        document.getElementById('d2ne_configuration_save').onclick = function(event) {
            _save_configuration();
            helpers.reload();
        };

        // Show/Hide config panel cache
        var _config_panel_cache = document.getElementById('d2ne_configuration_panel');
        var _config_panel_toggled_elements_cache = document.querySelectorAll('#d2ne_configuration_panel > h1 > span, #d2ne_configuration_panel > div');
        var _config_panel_toggled_elements_cache_length = _config_panel_toggled_elements_cache.length;

        // Show panel on hover
        config_panel_div.onmouseover = function(event) {
            _config_panel_cache.style['z-index'] = '11'; // This fix is needed for the spanish version, as the hero adds has a z-index of 10
            for (var i = 0; i < _config_panel_toggled_elements_cache_length; ++i) {
                _config_panel_toggled_elements_cache[i].style.display = 'inline';
            }
        };

        // Hide panel on mouse out
        config_panel_div.onmouseout = function(event) {
            for (var i = 0; i < _config_panel_toggled_elements_cache_length; ++i) {
                _config_panel_toggled_elements_cache[i].style.display = 'none';
            }
            _config_panel_cache.style['z-index'] = '9'; // See previous function comment
        };
    };

    /**
     * Load the script features.
     */
    var _load_features = function() {
        var features = {
            enable_shortcuts: function() {
                helpers.keydown_event(function(keycode, previous_keycode) {
                    if (previous_keycode !== _configuration.go_bind) {
                        return;
                    }
                    if (d2n_helpers.is_outside()) { // abort if outside
                        return;
                    }
                    for (var bind in _configuration.binds) {
                        if (_configuration.binds[bind] === keycode) {
                            return d2n_helpers.go_to_city_page(bind);
                        }
                    }
                });
            },

            hide_hero_adds: function() {
                helpers.injectCSS(
                    '.heroMode, #ghostHeroAd, #heroContainer, .promoBt, .sondageBg {' +
                        'display: none;' +
                    '}'
                );
            },

            highlight_ap: function() {
                helpers.wait_for_id('movesCounter', function(node) {
                    var highlight = function() {
                        var ap = d2n_helpers.get_number_of_ap();
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

                        node.style.border = '1px solid #' + colors[ap];
                    };
                    highlight();

                    var observer = new MutationObserver(function(mutations) {
                        highlight();
                    });
                    observer.observe(node, {childList: true});
                });
            },

            hide_help: function() {
                helpers.injectCSS(
                    '#mapTips, #ghost_pages .help {' +
                        'display: none' +
                    '}'
                );
            },

            hide_twinoid_bar: function() {
                helpers.injectCSS(
                    '#tid_bar {' +
                        'display: none;' +
                    '}' +
                    '#gamebody div.infoBar {' +
                        'top: 111px;' +
                    '}' +
                    'a#backReboot {' +
                        'top: 178px;' +
                    '}'
                );
            },

            hide_footer: function() {
                helpers.injectCSS(
                    '#tid_bar_down {' +
                        'display: none;' +
                    '}' +
                    '#fbAd {' +
                        'height: 0;' +
                        'overflow: hidden;' +
                    '}'
                );
            },

            hide_pegi: function() {
                helpers.injectCSS(
                    '.pegi {' +
                        'display: none;' +
                    '}'
                );
            },

            hide_rookie_mode: function() {
                helpers.injectCSS(
                    'div.block.tutorialBlock, div.expertMode {' +
                        'display: none;' +
                    '}'
                );
            },

            hide_guides: function() {
                helpers.injectCSS(
                    '.helpLink {' +
                        'display: none;' +
                    '}' +
                    '#generic_section > div > em:last-of-type {' +
                        'display: none;' +
                    '}'
                );
            },

            hide_rp_content: function() {
                helpers.injectCSS(
                    '.ambiant, .flavor {' +
                        'display: none;' +
                    '}'
                );
            }
        };

        // Browse all features, and check if they have to be activated
        for (var feature in features) {
            if (_configuration[feature] === true) {
                (features[feature])();
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
        helpers.wait_for_id('main', _load_configuration_panel);
    };

    return self;
})(); // !D2NE


/**
 * Die2Nite specific helpers
 */
var d2n_helpers = (function() {
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
    self.in_city = function()
    {
        return /^#city/.test(window.location.hash);
    };

    /**
     * Check if the given city page is loaded.
     * @param string page The page to check (a key from _pages_url)
     * @return string true if on the selected city page
     */
    self.is_on_city_page = function(page)
    {
        return helpers.match_regex(
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
            helpers.redirect('/#city/enter?go=' + page_url + ';sk=' + sk);
        } else { // else just download the content with an ajax request
            helpers.injectJS('js.XmlHttp.get(\'' + page_url + '?sk=' + sk + '\');');
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

        if (helpers.is_defined(el) && helpers.is_defined(el.href)) {
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

        if (helpers.is_defined(hostname) &&
            helpers.is_defined(websites_language[hostname])) {
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

        if (helpers.is_defined(el)) {
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
        return helpers.match_regex(
            window.location.hash,
            '^#outside\\?go=outside\\/refresh;sk=[a-z0-9]{5}$'
        );
    };

    return self;
})(); // !die2nite specific helpers


/**
 * Generic JavaScript helpers
 */
var helpers = (function() {
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
    self.removeElement = function(node) {
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

        if (helpers.is_defined(el = document.getElementById(id))) {
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

    return self;
})(); // !generic javascript helpers


D2NE.init();

})();
