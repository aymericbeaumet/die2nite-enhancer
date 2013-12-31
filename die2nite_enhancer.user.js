// ==UserScript==
// @name Die2Nite Enhancer
// @description Enhance your game experience!
// @author Aymeric Beaumet <aymeric@beaumet.me>
// @license zlib/libpng http://opensource.org/licenses/Zlib
// @updateURL
// https://github.com/abeaumet/die2nite_enhancer/raw/master/die2nite_enhancer.user.js
// @match *://www.die2nite.com/*
// @match *://www.hordes.fr/*
// @include *://www.die2nite.com/*
// @include *://www.hordes.fr/*
// @version 0.0.1
// ==/UserScript==

"use strict";

window.addEventListener('load', function() {

    /*****************
     * Configuration *
     *****************/

    window.d2n_enhancer = {
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

    /*******************
     * Generic helpers *
     *******************/

    // Return true if a variable is defined
    function is_defined(v)
    {
        return (typeof v !== 'undefined' && v !== null);
    }

    // Catch a keydown event, abort if the cursor is in an input field.
    // Call the callback `f` with the keycodes
    function keydown_event(f, time_limit)
    {
        // defaut 1000ms between two key strokes
        time_limit = (is_defined(time_limit)) ? time_limit : 1000;

        document.addEventListener('keydown', function(event) {
            // Cancel event if the cursor is in an input field
            if (event.target.nodeName === 'INPUT') {
                return;
            }

            // Cancel event if elapsed time is too long between two key strokes
            if (event.timeStamp - window.keydown_event.previous_keycode_timestamp > time_limit) {
                window.keydown_event.previous_keycode = null;
            }

            // Invoke callback
            f(event.keyCode, window.keydown_event.previous_keycode);

            // Save keycode
            window.keydown_event.previous_keycode = event.keyCode;
            window.keydown_event.previous_keycode_timestamp = event.timeStamp;
        }, false);
    }
    window.keydown_event = {
        previous_keycode: 0,
        previous_keycode_timestamp: 0,
    };

    // From: http://stackoverflow.com/a/14901197/1071486
    // Inject and execute a function in the page context
    function injectJS(a)
    {
        var b, c;

        if (typeof a === 'function') {
            b = '(' + a + ')();';
        } else {
            b = a;
        }
        c = document.createElement('script');
        c.textContent = b;
        document.body.appendChild(c);
        return c;
    };

    // From: http://stackoverflow.com/a/14782/1071486
    function removeElement(node) {
        node.parentNode.removeChild(node);
    }

    /*********************
     * Die2Night helpers *
     *********************/

    var d2n = (function() {
        var module = {};

        var pages_url = {
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
        module.in_city = function()
        {
            return /^#city/.test(window.location.hash);
        };

        // Return true if on the selected city page
        module.on_city_page = function(page)
        {
            var r = new RegExp('^#city\/enter\?go=' + pages_url[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$');
            return r.test(window.location.hash);
        };

        // Go to a specific city page
        module.go_to_city_page = function(page)
        {
            var url = pages_url[page] + '?sk=' + module.get_sk();
            injectJS('js.XmlHttp.get(\'' + url + '\');');
        };

        // Return the sk (session/secret key?)
        module.get_sk = function()
        {
            var matches = /sk=([a-z0-9]{5})$/.exec(window.location.hash);
            return matches[1];
        };

        // Return a HTML string displaying a help popup
        module.help_popup = function(message)
        {
            // defaut empty message
            message = (is_defined(message)) ? message : '';

            return '<a href="#" onclick="return false;" onmouseover="js.HordeTip.showHelp(this,\'' + message + '\')" onmouseout="js.HordeTip.hide()" class="helpLink"><img src="http://data.die2nite.com/gfx/loc/en/helpLink.gif" alt=""></a>';
        }

        return module;
    }());


    /*************************
     * Script initialisation *
     *************************/

    // Initialise the script
    (function init(){

        /*
         * Create configuration panel
         */

        // Create panel
        var config_panel_div = document.createElement('div');
        config_panel_div.id = 'd2n_config_panel';
        config_panel_div.innerHTML =
            '<h1><img src="http://data.hordes.fr/gfx/forum/smiley/h_city_up.gif" alt=""> <span>Die2Nite Enhancer - Configuration</span></h1>' +
            '<div>' +
            '<br />' +
            '<form>' +
                '<input type="checkbox" id="d2n_config_enable_shortcuts" /><label for="d2n_config_enable_shortcuts">Enable shortcuts</label>' + d2n.help_popup('Let you use shortcuts in town to quickly access important places (e.g.: banks, gates).') +
                '<br />' +
                '<input type="checkbox" id="d2n_config_hide_hero_adds" /><label for="d2n_config_hide_hero_adds">Hide hero adds</label>' + d2n.help_popup('Hide hero adds all over the site.') +
                '<br />' +
                '<input type="button" id="d2n_config_save" value="Save" />' +
            '</form>' +
            '<div class="clear"></div>' +
            '<br />' +
            '<p style="text-align:center"><a href="https://github.com/abeaumet/die2nite_enhancer" target="_blank">Die2Nite Enhancer v0.0.1</a></p>' +
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
                '-moz-border-radius:0;' +
                'outline:1px solid #000;' +
                'border:1px solid #f0d79e;' +
            '}' +
            '#d2n_config_panel > h1 > span, #d2n_config_panel > div {' +
                'display: none;' +
            '}' +
            '#d2n_config_panel > div {' +
                'width: 480px;' +
            '}' +
            '#d2n_config_panel a.helpLink img {' +
                'margin-bottom: -0.4em;' +
                'margin-left: 0.6em;' +
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
            '#d2n_config_panel a.link {' +
                'display:block;' +
                'width:160px;' +
                'height:18px;' +
                'overflow:hidden;' +
                'text-decoration:none;' +
            '}' +
            '#d2n_config_panel p {' +
                'font-size:9pt;' +
                'line-height:11pt;' +
                'text-align:justify;' +
                'margin:0 0 5px;' +
                'padding:0;' +
            '}' +
            '#d2n_config_save {' +
                'float: right;' +
            '}';

        // Insert panel style
        document.head.appendChild(config_panel_css);

        document.getElementById('d2n_config_save').onclick = function(event) {
            event.srcElement.disabled = true;
            event.srcElement.value = 'Saved!';
            //location.reload();
        };

        // Show/Hide config panel cache
        var _show_hide_config_panel_cache = document.querySelectorAll('#d2n_config_panel > h1 > span, #d2n_config_panel > div');
        var _show_hide_config_panel_cache_length = _show_hide_config_panel_cache.length;

        // Show panel on hover
        config_panel_div.onmouseover = function(event) {
            for (var i = 0; i < _show_hide_config_panel_cache_length; i++) {
                _show_hide_config_panel_cache[i].style.display = 'inline';
            }
        };

        // Hide panel on mouse out
        config_panel_div.onmouseout = function(event) {
            for (var i = 0; i < _show_hide_config_panel_cache_length; i++) {
                _show_hide_config_panel_cache[i].style.display = 'none';
            }
        };


        /*
         * Binds
         */
        if (window.d2n_enhancer.enable_binds === true) {
            keydown_event(function(keycode, previous_keycode) {
                if (d2n.in_city()) {
                    if (previous_keycode === window.d2n_enhancer.go_bind) {
                        for (var bind in window.d2n_enhancer.binds) {
                            if (window.d2n_enhancer.binds[bind] === keycode) {
                                d2n.go_to_city_page(bind);
                            }
                        }
                    }
                }
            });
        }


        /*
         * Hero adds
         */
        if (window.d2n_enhancer.remove_hero_adds === true) {
            var adds = [
                document.getElementById('heroContainer'),
                document.getElementById('ghostHeroAd'),
                document.querySelectorAll('div.heroMode')[0]
            ];

            for (var length = adds.length, i = 0; i < length; i++) {
                if (is_defined(adds[i])) {
                    removeElement(adds[i]);
                }
            }
        }
    }());

});
