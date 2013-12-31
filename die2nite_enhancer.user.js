// ==UserScript==
// @name Die2Nite Enhancer
// @description Enhance your game experience!
// @author Aymeric Beaumet <aymeric@beaumet.me>
// @license zlib/libpng http://opensource.org/licenses/Zlib
// @updateURL https://github.com/abeaumet/die2nite_enhancer/raw/master/die2nite_enhancer.user.js
// @match *://www.die2nite.com/*
// @match *://www.hordes.fr/*
// @include *://www.die2nite.com/*
// @include *://www.hordes.fr/*
// @version 0.0.1
// ==/UserScript==

"use strict";

(function() {

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
        help_image_url: 'http://www.die2nite.com/gfx/loc/en/helpLink.gif',
        configuration_title: 'Die2Nite Enhancer - Settings',
        enable_shortcuts: 'Enable shortcuts',
        enable_shortcuts_help: 'Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).',
        save_button: 'Save'
    },
    fr: {
        script_description: 'Die2Nite Enhancer vous permet d\'améliorer votre expérience de jeu, toutes ces fonctionalités peuvent être configurées depuis ce panneau.',
        help_image_url: 'http://data.hordes.fr/gfx/loc/fr/helpLink.gif',
        configuration_title: 'Die2Nite Enhancer - Paramètres',
        enable_shortcuts: 'Activer les raccourcis',
        enable_shortcuts_help: 'Vous permet d\'utiliser des raccourcis pour accéder rapidement aux places importants (e.g.: la banque, les portes).',
        save_button: 'Sauvegarder'
    }
};


/**
 * Die2Nite Enhancer
 */
var D2NE = (function() {
    var self = {};

    /**
     * The default configuration.
     */
    var _default_configuration = {
        // script language
        language: 'en',

        // Set to false to disable the binds
        enable_binds: true,
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

        // See to false to show hero adds
        remove_hero_adds: true
    };

    /**
     * The loaded configuration.
     */
    var _configuration = null;

    /**
     * Load the configuration from the default one.
     */
    var _load_configuration = function() {
        _configuration = JSON.parse(JSON.stringify(_default_configuration));
    };

    /**
     * The script strings.
     */
    var _i18n = null;

    var _load_internationalisation = function() {
        _i18n = i18n[_configuration.language];
    };

    /**
     * Create the configuration panel.
     */
    var _load_configuration_panel = function() {
        // Create panel
        var config_panel_div = document.createElement('div');
        config_panel_div.id = 'd2n_config_panel';
        config_panel_div.innerHTML =
            '<h1><img src="/gfx/forum/smiley/h_city_up.gif" alt=""><span style="display:none"> ' + _i18n.configuration_title + '</span></h1>' +
            '<div style="display:none">' +
            '<p style="border-bottom: 1px dashed #ddab76;padding-bottom: 6px;">' + _i18n.script_description + '</p>' +
            '<table>' +
                '<tr><td><input type="checkbox" id="d2n_config_enable_shortcuts" /><label for="d2n_config_enable_shortcuts">' + _i18n.enable_shortcuts + '</label></td><td>' + d2n_helpers.help_popup(_i18n.enable_shortcuts_help) + '</td></tr>' +
                '<tr><td colspan="2"><a href="#" id="d2n_config_save" class="button">' + _i18n.save_button + '</a></td></tr>' +
            '</table>' +
            '<div class="clear"></div>' +
            '<p style="text-align:center;border-top: 1px dashed #ddab76;padding-top: 6px;"><a href="' + PROJECT_PAGE + '" target="_blank">' + SCRIPT_NAME +' v' + SCRIPT_VERSION + '</a></p>' +
            '</div>';

        // Insert panel
        var main_div = document.getElementById('main');
        main_div.insertBefore(config_panel_div, main.firstChild);

        // Create panel style
        var config_panel_css = document.createElement('style');
        config_panel_css.type = 'text/css';
        config_panel_css.innerHTML =
            '#d2n_config_panel {' +
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
            '#d2n_config_panel h1 {' +
                'height:auto;' +
                'font-size:8pt;' +
                'text-transform:none;' +
                'font-variant:small-caps;' +
                'background:none;' +
                'cursor:help;' +
                'margin:0;' +
                'padding:0;' +
            '}' +
            '#d2n_config_panel:hover h1 {' +
                'border-bottom:1px solid #b37c4a;' +
                'margin-bottom:5px;' +
            '}' +
            '#d2n_config_panel p {' +
                'margin: 0px;' +
                'padding: 0px;' +
                'width: 430px;' +
                'margin-bottom: 5px;' +
                'font-size: 9pt;' +
                'line-height: 11pt;' +
                'text-align: justify;' +
            '}' +
            '#d2n_config_panel a.button {' +
                'width: auto;' +
                'text-align: center;' +
                'padding: 0;' +
            '}' +
            'a.d2n_tooltip {' +
                'display: inline;' +
                'position: relative;' +
                'cursor: help' +
            '}' +
            'a.d2n_tooltip img {' +
                'margin-left: 10px;' +
                'margin-top: 2px;' +
                'border: 1px solid #5c2b20;' +
            '}' +
            'a.d2n_tooltip img:hover {' +
                'border: 1px solid #ffffff;' +
            '}' +
            'a.d2n_tooltip:hover:after {' +
                'z-index: 98;' +
                'position: absolute;' +
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
            '}';

        // Insert panel style
        document.getElementsByTagName('head')[0].appendChild(config_panel_css);

        document.getElementById('d2n_config_save').onclick = function(event) {
            location.reload();
        };

        // Show/Hide config panel cache
        var show_hide_config_panel_cache = document.querySelectorAll('#d2n_config_panel > h1 > span, #d2n_config_panel > div');
        var show_hide_config_panel_cache_length = show_hide_config_panel_cache.length;

        // Show panel on hover
        config_panel_div.onmouseover = function(event) {
            for (var i = 0; i < show_hide_config_panel_cache_length; ++i) {
                show_hide_config_panel_cache[i].style.display = 'inline';
            }
        };

        // Hide panel on mouse out
        config_panel_div.onmouseout = function(event) {
            for (var i = 0; i < show_hide_config_panel_cache_length; ++i) {
                show_hide_config_panel_cache[i].style.display = 'none';
            }
        };
    };

    /**
     * Set up the script.
     */
    self.init = function() {
        _load_configuration();
        _load_internationalisation();
        _load_configuration_panel();
    };

    /**
     * Enable the binds feature.
     */
    var _enable_binds = function() {
        helpers.keydown_event(function(keycode, previous_keycode) {
            if (d2n_helpers.in_city()) {
                if (previous_keycode === _configuration.go_bind) {
                    for (var bind in _configuration.binds) {
                        if (_configuration.binds[bind] === keycode) {
                            d2n_helpers.go_to_city_page(bind);
                        }
                    }
                }
            }
        });
    };

    /**
     * Run the script features.
     */
    self.run = function() {
        if (_configuration.enable_binds === true) {
            _enable_binds();
        }
    }

    return self;
})(); // !D2NE


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
            // Cancel event if the cursor is in an input field
            if (event.target.nodeName === 'INPUT') {
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
     * Inject and execute JavaScript code in the page context.
     * @link http://stackoverflow.com/a/14901197/1071486
     * @param string/callback code The code to inject
     */
    self.injectJS = function(code)
    {
        var encapsuled_code, html_encapsuled_code;

        if (typeof code === 'function') {
            encapsuled_code = '(' + code + ')();';
        } else {
            encapsuled_code = code;
        }
        html_encapsuled_code = document.createElement('script');
        html_encapsuled_code.textContent = encapsuled_code;
        document.body.appendChild(html_encapsuled_code);
    };

    /**
     * Remove an DOM node.
     * @link http://stackoverflow.com/a/14782/1071486
     * @param DOMNode node The DOM node to delete
     */
    self.removeElement = function(node) {
        node.parentNode.removeChild(node);
    }

    return self;
})(); // !generic javascript helpers


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

    // Return true if inside the city, false otherwise
    self.in_city = function()
    {
        return /^#city/.test(window.location.hash);
    };

    // Return true if on the selected city page
    self.on_city_page = function(page)
    {
        var r = new RegExp('^#city\/enter\?go=' + _pages_url[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$');
        return r.test(window.location.hash);
    };

    // Go to a specific city page
    self.go_to_city_page = function(page)
    {
        var url = _pages_url[page] + '?sk=' + self.get_sk();
        helpers.injectJS('js.XmlHttp.get(\'' + url + '\');');
    };

    // Return the sk (session/secret key?)
    self.get_sk = function()
    {
        var matches = /sk=([a-z0-9]{5})$/.exec(window.location.hash);
        return matches[1];
    };

    // Return a HTML string of an image displaying a help popup with the
    // given message
    self.help_popup = function(message)
    {
        // defaut empty message
        message = (helpers.is_defined(message)) ? message : '';

        return '<a href="#" onclick="return false;" tooltip="' + message + '" class="d2n_tooltip"><img src="http://www.die2nite.com/gfx/loc/en/helpLink.gif" alt="" /></a>';
    }

    return self;
})(); // !die2nite specific helpers


window.addEventListener('load', function() {
    D2NE.init();
    D2NE.run();
}, false);

})();
