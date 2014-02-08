/******************************************************************************
 *                                                                            *
 *  Die2Nite helpers class                                                    *
 *                                                                            *
 ******************************************************************************/

var D2N = (function() {

/*
 * private:
 */

    var pages_url_ = {
        // in town
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

        // in/out of town
        ghost: 'ghost/user',
        ghost_exp: 'ghost/heroUpgrades',
        settings: 'ghost/options'
    };

    var websites_language_ = {
        'www.die2nite.com': 'en',
        'www.hordes.fr': 'fr',
        'www.zombinoia.com': 'es',
        'www.dieverdammten.de': 'de'
    };

    /**
     * Emit a gamebody reload event.
     */
    function emit_gamebody_reloaded_event()
    {
        JS.dispatch_event('d2n_gamebody_reload');
    }


    /**
     * Wait for a gamebody reload and emit the corresponding event then.
     */
    function add_gamebody_reload_event()
    {
        var watch_for_gamebody_reload = function(limit) {
            limit = (typeof limit === 'undefined') ? 20 : limit;

            // If the limit isn't reached and the hash isn't defined, call this
            // function again (this is done to wait the first load)
            if (limit > 0 && window.location.hash === '') {
                return setTimeout(function() { watch_for_gamebody_reload(limit - 1); }, 200);
            }

            JS.wait_for_tag('body', function(nodes) {
                var body_observer = new MutationObserver(function(mutations) {
                    for (var i = 0, max = mutations.length; i < max; i += 1) {
                        if (mutations[i].type !== 'attributes' ||
                            mutations[i].attributeName !== 'style') {
                            continue;
                        }

                        if (mutations[i].target.style.cursor === 'default') {
                            emit_gamebody_reloaded_event();
                            break;
                        }
                    }
                });

                // 1. If the cursor is 'default' it means the page is loaded
                // (and that we missed the cursor change). In this case, just
                // emit an event.
                if (nodes[0].style.cursor === 'default') {
                    emit_gamebody_reloaded_event();
                }

                // 2. Then watch for a cursor style change on the body tag,
                // which means the end of a content load for the page
                body_observer.observe(nodes[0], { attributes: true });
            });
        };
        watch_for_gamebody_reload();
    }

    /**
     * Emit an AP change event.
     */
    function emit_ap_change_event()
    {
        JS.dispatch_event('d2n_apchange');
    }

    /**
     * Wait for an ap change and call emit the corresponding event then.
     */
    function add_ap_change_event()
    {
        // only watch AP change in town
        D2N.is_in_town(function(in_town) {
            if (in_town) {

                // Store the observer to always have at least 1 active
                var ap_observer = null;
                var ap_old_observer = null;

                var watch_for_ap_change = function() {
                    JS.wait_for_id('movesCounter', function(node) {
                        ap_old_observer = ap_observer;

                        // Watch for AP change
                        ap_observer = new MutationObserver(function(mutations) {
                            emit_ap_change_event();
                        });

                        ap_observer.observe(node, { childList: true, subtree: true });

                        if (ap_old_observer !== null) {
                            ap_old_observer.disconnect();
                            ap_old_observer = null;
                        }
                    });
                };
                watch_for_ap_change(); // watch on first load

                emit_ap_change_event(); // dispatch event on first load

                // watch again when the page change
                window.addEventListener('hashchange', function() {
                    watch_for_ap_change();
                }, false);

            }
        });
    }

    /**
     * Emit a forum topic event.
     * @param DOMNode[] nodes All the forum posts on the current page
     */
    function emit_forum_topic_event(nodes)
    {
        JS.dispatch_event('d2n_forum_topic', {
            posts: nodes
        });
    }

    /**
     * Wait for a forum topic to load and emit the corresponding event then.
     */
    function add_forum_topic_event()
    {
        if (!D2N.is_on_forum()) {
            return;
        }

        var watch_for_forum_topic = function() {
            if (!D2N.is_on_forum_topic()) {
                return;
            }

            JS.wait_for_id('tid_forum_right', function(node) {
                JS.wait_for_class('tid_post', function(nodes) {
                    emit_forum_topic_event(nodes);
                });
            });
        };
        watch_for_forum_topic();

        window.addEventListener('hashchange', function() {
            watch_for_forum_topic();
        });
    }


/*
 * public:
 */

    return {

        /**
         * Check whether the user is logged.
         * @param callback callback The callback to call with the result
         */
        is_logged: function(callback)
        {
            JS.wait_for_id('tid_sidePanel_user', function(node) {
                callback(true); // logged if the side panel exists
            }, 20, function(node) {
                callback(false); // else not logged
            });
        },

        /**
         * Check if the player is on the forum.
         * @return bool true if on the forum, false otherwise
         */
        is_on_forum: function()
        {
            return (window.location.pathname === '/tid/forum');
        },

        /**
         * Check if the player is on a forum topic.
         * @return bool true if on a forum topic, false otherwise
         */
        is_on_forum_topic: function()
        {
            return D2N.is_on_forum() &&
                /^#!view\/\d+\|thread\/\d+(?:\?p=\d+)?$/.test(window.location.hash);
        },

        /**
         * Check if the user is playing in a town or not (do not confound with
         * `is_in_city`). Call the function `callback` with the result
         */
        is_in_town: function(callback)
        {
            JS.wait_for_id('clock', function if_found() {
                callback(true);
            }, 5, function if_not_found() {
                callback(false);
            });
        },

        /**
         * Check if the player is in the city. Return false if the user is in the city
         * but on the forum.
         * @return bool true if inside the city, false otherwise
         */
        is_in_city: function()
        {
            return JS.regex_test(
                '^#city',
                window.location.hash
            );
        },

        /**
         * Check if the player is outside the city. Return false if the user is
         * outside but on the forum.
         * @return string true if outside, false otherwise
         */
        is_outside: function()
        {
            return /^#outside\?(?:go=outside\/refresh;)?sk=[a-z0-9]{5}$/.test(window.location.hash);
        },

        /**
         * Check if the given page is loaded (in or out of city).
         * @param string page The page to check (a key from pages_url_)
         * @return string true if on the selected page
         */
        is_on_page: function(page)
        {
            return (D2N.is_on_page_in_city(page) ||
                    D2N.is_on_page_out_of_city(page));
        },

        /**
         * Check if the given city page is loaded.
         * @param string page The page to check (a key from pages_url_)
         * @return string true if on the selected city page
         */
        is_on_page_in_city: function(page)
        {
            return JS.regex_test('^#city\\/enter\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$', window.location.hash) ||
                JS.regex_test('^#ghost\\/city\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$', window.location.hash);
        },

        /**
         * Check if the given page is loaded (not in city).
         * @param string page The page to check (a key from pages_url_)
         * @return string true if on the selected page (not in city)
         */
        is_on_page_out_of_city: function(page)
        {
            return JS.regex_test(
                '^#ghost\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$',
                window.location.hash
            );
        },

        /**
         * Load a specific city page.
         * @param string page The page to go (a key from pages_url_)
         */
        go_to_city_page: function(page)
        {
            // if not in a town, outside city or already on the page, abort
            D2N.is_in_town(function(in_town) {
                if (!(in_town || D2N.is_outside() || D2N.is_on_page_in_city(page))) {
                    return;
                }

                D2N.get_session_key(function(sk) {
                    var page_url = pages_url_[page];

                    if (D2N.is_on_forum()) { // if on the forum, redirect to the desired page
                        JS.redirect('/#city/enter?go=' + page_url + ';sk=' + sk);
                    } else { // else just download the content with an ajax request
                        JS.injectJS('js.XmlHttp.get(' + JSON.stringify(page_url + '?sk=' + sk) + ');');
                    }
                });
            });
        },

        /**
         * Find the session key.
         * @param callback callback The function to call once the sk is fetched
         */
        get_session_key: function(callback)
        {
            JS.wait_for_selector('a.mainButton.newsButton', function(node) {
                var arr = node.href.split('=');

                // pass rhe string after the last equal which should be the
                // session key
                callback(arr[arr.length - 1]);
            });
        },

        /**
         * Give the website language (specific to D2N/Hordes). Return 'en' by
         * default.
         * @return string The language of the current page ('en' / 'fr')
         * @return null if no corresponding language can be found
         */
        get_website_language: function()
        {
            var hostname = window.location.hostname;

            if (JS.is_defined(hostname) &&
                JS.is_defined(websites_language_[hostname])) {
                return websites_language_[hostname];
            }

            return null;
        },

        /**
         * Call the given callback with the number of AP.
         * @param callback callback The function to call
         */
        get_number_of_ap: function(callback)
        {
            JS.wait_for_selector('#movesCounter > div', function(node) {
                var ap = parseInt(node.textContent.split('/')[0]);
                callback(ap);
            });
        },

        /**
         * Check if the user is outside and camping.
         * @return boolean true if the user is outside and camping, otherwise false
         */
        is_camping: function()
        {
            return D2N.is_outside() &&
                document.getElementsByClassName('left').length < 1;
        },

        /**
         * Add custom events on the interface:
         * - to watch when the gamebody is reloaded: 'd2n_gamebody_reload'
         * - to watch the number of AP: 'd2n_apchange'
         */
        add_custom_events: function()
        {
            add_gamebody_reload_event();
            add_ap_change_event();
            add_forum_topic_event();
        },

        /**
         * Check if on Die2Nite.
         * @return boolean true if on Die2Nite, else false
         */
        is_on_die2nite: function() {
            return window.location.hostname === 'www.die2nite.com';
        },

        /**
         * Check if on Hordes.
         * @return boolean true if on Hordes, else false
         */
        is_on_hordes: function() {
            return window.location.hostname === 'www.hordes.fr';
        },

        /**
         * Check if on Zombinoia.
         * @return boolean true if on Zombinoia, else false
         */
        is_on_zombinoia: function()
        {
            return window.location.hostname === 'www.zombinoia.com';
        },

        /**
         * Check if on Dieverdammten.
         * @return boolean true if on Dieverdammten, else false
         */
        is_on_dieverdammten: function()
        {
            return window.location.hostname === 'www.dieverdammten.de';
        },

        /**
         * Get an external tool api key and pass it to the given callback
         * @param integer directory_id The external tool id
         * @param Function callback The callback to pass the api key
         */
        get_api_key: function(directory_id, callback_success, callback_failure)
        {
            // Fetch the session key
            D2N.get_session_key(function(sk) {
                JS.network_request('GET', '/disclaimer?id=' + directory_id + ';sk=' + sk, null, null,
                    function on_success(data, context) {
                        var match = data.match(/<input type="hidden" name="key" value="([a-f0-9]{38,39})"\/>/);
                        if (JS.is_defined(match) && match.length === 2) {
                            callback_success(match[1]);
                        } else {
                            callback_failure();
                        }
                    },
                    function onfailure() {
                        callback_failure();
                    }
                );
            });
        },

        /**
         * Remove a player action (in house or outside).
         * @param string/RegExp pattern The action name
         */
        remove_player_action: function(pattern)
        {
            // if not at home or outside (the two only places where a player
            // can use an object), abort
            if (!(D2N.is_on_page_in_city('home') || D2N.is_outside())) {
                return;
            }

            // else list all the possible objects usable by the player
            JS.wait_for_selector_all('a.toolAction > span > strong', function(nodes) {
                nodes.forEach(function(node) {
                    // Skip the node if not a 'strong' element
                    if (node.nodeName !== 'STRONG') {
                        return;
                    }

                    // Hide the node if matching the pattern
                    if ((typeof pattern === "string" && node.textContent === pattern) ||
                        (pattern instanceof RegExp && pattern.test(node.textContent))) {

                        var action = node.parentNode.parentNode;
                        action.style.display = 'none';
                    }
                });
            }, 5);
        }

    };

})();
