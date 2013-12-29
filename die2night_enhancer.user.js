// ==UserScript==
// @name Die2Night Enhancer
// @description Enhance your game experience!
// @author Aymeric Beaumet <aymeric@beaumet.me>
// @license zlib/libpng http://opensource.org/licenses/Zlib
// @updateURL https://github.com/abeaumet/hordes_enhancer/raw/master/die2night_enhancer.user.js
// @match *://www.die2nite.com/*
// @match *://www.hordes.fr/*
// @include *://www.die2nite.com/*
// @include *://www.hordes.fr/*
// @version 0.0.1
// ==/UserScript==

// Local scope
;(function(undefined){

    /*****************
     * Configuration *
     *****************/

    window.enhancer = {
        enable_binds: true, // set to false to disable the binds
        bind_elapsed_time_limit: 1000, // Longest elapsed time between two binds (ms)
        go_bind: 71, // 'G'
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

        pages_url: {
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
        }
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

    /*********************
     * Die2Night helpers *
     *********************/

    // Return true if inside the city, false otherwise
    function in_city()
    {
        return /^#city/.test(window.location.hash);
    }

    // Return true if on the selected city page
    function on_city_page(page)
    {
        var r = new RegExp('^#city\/enter\?go=' + window.enhancer.pages_url[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$');
        return r.test(window.location.hash);
    }

    // Go to a specific city page
    function go_to_city_page(page)
    {
        var url = window.enhancer.pages_url[page] + '?sk=' + get_sk();
        injectJS('js.XmlHttp.get(\'' + url + '\');');
    }

    // Return the sk (session/secret key?)
    function get_sk()
    {
        var matches = /sk=([a-z0-9]{5})$/.exec(window.location.hash);
        return matches[1];
    }

    /*************************
     * Script initialisation *
     *************************/

    (function init(){

        // Binds
        if (window.enhancer.enable_binds === true) {
            keydown_event(function(keycode, previous_keycode) {
                if (in_city()) {
                    if (previous_keycode === window.enhancer.go_bind) {
                        for (bind in window.enhancer.binds) {
                            if (window.enhancer.binds[bind] === keycode) {
                                go_to_city_page(bind);
                            }
                        }
                    }
                }
            });
        }
    })();

})();
