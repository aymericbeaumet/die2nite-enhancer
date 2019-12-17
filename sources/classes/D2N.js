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
        settings: 'ghost/options',

        // Not in a game
        maps: 'ghost/maps'
    };

    var websites_language_ = {
        'www.die2nite.com': 'en',
        'www.hordes.fr': 'fr',
        'www.zombinoia.com': 'es',
        'www.dieverdammten.de': 'de'
    };

    var session_key_cache_ = null;

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
        if (D2N.is_on_forum()) {
            return;
        }

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

                emit_ap_change_event(); // dispatch event on first load

                if (D2N.is_on_forum()) {
                    return;
                }

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

                // watch again when the page change
                window.addEventListener('hashchange', function() {
                    watch_for_ap_change();
                }, false);

            }
        });
    }

    /**
     * Emit a forum topic event.
     */
    function emit_forum_topic_event()
    {
        JS.dispatch_event('d2n_forum_topic');
    }

    /**
     * Wait for a forum topic to load and emit the corresponding event then.
     */
    function add_forum_topic_event()
    {
        if (!D2N.is_on_forum()) {
            return;
        }

        JS.wait_for_id('tid_forum_right', function(node) {
            // if the posts are already loaded, emit the event
            if (document.getElementsByClassName('tid_post').length > 0) {
                emit_forum_topic_event();
            }

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.removedNodes.length <= 0) {
                        return;
                    }

                    for (var i = 0, max = mutation.removedNodes.length; i < max; i++) {
                        if (mutation.removedNodes[i].className === 'tid_loading') {
                            emit_forum_topic_event();
                            return;
                        }
                    }
                });
            });
            observer.observe(node, { childList: true });
        }, 10);
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
            return D2N.is_on_forum() && /^#!view\/\d+\|thread\/\d+(?:\?p=\d+)?$/.test(window.location.hash);
        },

        /**
         * Check if the player is on the gazette.
         * @return bool true if on the gazette, false otherwise
         */
        is_on_gazette: function()
        {
            return JS.regex_test('^#news', window.location.hash);
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
            return JS.regex_test('^#city', window.location.hash);
        },

        /**
         * Check if the player is outside the city. Return false if the user is
         * outside but on the forum.
         * @return string true if outside, false otherwise
         */
        is_outside: function()
        {
            return (/^#outside\?(?:go=outside\/(?:doors|refresh);)?sk=[a-z0-9]{5}$/).test(window.location.hash);
        },

        /**
         * Check if the player is outside the city, but still at the doors. Return false if user is
         * outside but on the forum
         * @return string true if outside and at the doors, false otherwise
         */
        is_outside_at_doors: function(){
        return (/^#outside\?(?:go=outside\/doors;)?sk=[a-z0-9]{5}$/).test(window.location.hash);
        },

        /**
         * Check if the given page is loaded (in or out of city).
         * @param string page The page to check (a key from pages_url_)
         * @return string true if on the selected page
         */
        is_on_page: function(page)
        {
            return (D2N.is_on_page_in_city(page) || D2N.is_on_page_out_of_city(page));
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
            return JS.regex_test('^#ghost\\?go=' + pages_url_[page].replace('/', '\\/') + '.*;sk=[a-z0-9]{5}$', window.location.hash);
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

                    JS.redirect('/#city/enter?go=' + page_url + ';sk=' + sk);
                });
            });
        },

        /**
         * Find the session key.
         * @param callback callback The function to call once the sk is fetched
         */
        get_session_key: function(callback)
        {
            // if the cache defined, give it immediately
            if (typeof session_key_cache_ === 'string' && session_key_cache_ !== '') {
                return callback(session_key_cache_);
            }

            // else fetch it
            JS.wait_for_selector('a.mainButton.newsButton', function(node) {
                var arr = node.href.split('=');

                // store the key in the cache
                session_key_cache_ = arr[arr.length - 1];

                // pass it to the callback
                return callback(session_key_cache_);
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
         * Call the given callback with the number of AP (Action Points)
         * @param callback callback The function to be called
         */
        get_number_of_ap: function(callback)
        {
            JS.wait_for_selector('#movesCounter > div img[src*="small_pa.gif"]', function(node) {
                var ap = parseInt(node.parentNode.textContent.split('/')[0]);
                callback(ap);
            });
        },

        /**
         * Call the given callback with the number of CP (Construction Points).
         * @param callback callback The function to be called, pass null if the
         * player doesn't have a CP div (it means he/she's not a Technician)
         */
        get_number_of_cp: function(callback)
        {
            JS.wait_for_selector('#movesCounter > div img[src*="small_pc.gif"]', function(node) {
                var cp = parseInt(node.parentNode.textContent.split('/')[0]);
                callback(cp);
            }, 1, function onNotfound() {
                callback(null);
            });
        },

        /**
         * Call the given callback with the total number of AP + CP.
         * @param callback callback The function to be called
         */
        get_number_of_ap_cp: function(callback)
        {
            D2N.get_number_of_ap(function(ap) {
                D2N.get_number_of_cp(function(cp) {
                    var total = ap;
                    if (typeof cp === 'number') {
                        total += cp;
                    }
                    callback(total);
                });
            });
        },

        /**
         * Check if the user is outside and camping.
         * @return boolean true if the user is outside and camping, otherwise false
         */
        is_camping: function()
        {
            return D2N.is_outside() && document.getElementsByClassName('left').length < 1;
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
         * Check if on one of the 4 game websites.
         * @return boolean true if on one of the game websites, else false
         */
        is_on_game_website: function()
        {
            return D2N.is_on_die2nite() ||
                D2N.is_on_hordes() ||
                D2N.is_on_zombinoia() ||
                D2N.is_on_dieverdammten();
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
        },

        /**
         * Redirect to a citizen soul.
         * @param integer citizen_id
         * @param string random (optional) A random string to be appended
         */
        redirect_to_citizen_soul: function(citizen_id, random)
        {
            D2N.get_session_key(function(session_key) {
                var url = '/#ghost/city?go=ghost/user?uid=' + citizen_id + ';sk=' + session_key;
                if (typeof random === 'string' && random.length > 0) {
                    url += '?' + random;
                }
                JS.redirect(url);
            });
        },

        /**
         * Display a notification in the native D2N way.
         * @param DOMElement el The element to insert in the notification. If a
         * string is given, it is wrapped into a simple div.
         */
        notification: function(new_element)
        {
            var el;

            // Wrapped the new element if needed
            if (typeof new_element === 'string') {
                el = JS.jsonToDOM(['div', {}, new_element], document);
            } else {
                el = new_element;
            }

            // Get notification div
            var notif = document.getElementById('notificationText');

            // Empty it
            JS.delete_all_children(notif);

            // Add the new content
            notif.appendChild(el);

            // Get the notification container
            var notif_container = document.getElementById('notification');

            // Scroll to the top
            scroll(0, 0);

            // Display the notification
            notif_container.classList.add('showNotif');
        },

        /**
         * Show an empty notification.
         */
        show_empty_notification: function()
        {
            document.getElementById('notification').classList.add('showNotif');
        },

        /**
         * Hide empty notification.
         */
        hide_empty_notification: function()
        {
            document.getElementById('notification').classList.remove('showNotif');
        },

        /**
         * Return the city name.
         */
        get_city_name: function(callback)
        {
            var selector = '#clock .name';

            // async
            if (typeof callback === 'function') {
                JS.wait_for_selector(selector, function(node) {
                    callback(node.textContent.trim());
                }, 5, function() {
                    callback(null);
                });

            // sync
            } else {
                var el = document.querySelector(selector);
                if (!el) { return null; }
                return el.textContent.trim();
            }
        },

        /**
         * Return the server name.
         */
        get_server_name: function()
        {
            return window.location.hostname;
        },

        /**
         * Return the player name.
         */
        get_player_name: function()
        {
            var el = document.querySelector('#tid_openRight .tid_name');

            if (!el) {
                return null;
            }
            return el.textContent.trim();
        }

    };

})();
