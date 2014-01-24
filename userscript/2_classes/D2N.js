/******************************************************************************
 *                                                                            *
 *  Die2Nite helpers class                                                    *
 *                                                                            *
 ******************************************************************************/

var D2N = (function() {

/*
  private:
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

/*
  public:
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
            return JS.match_regex(
                window.location.hash,
                '^#city'
            );
        },

        /**
         * Check if the player is outside the city. Return false if the user is
         * outside but on the forum.
         * @return string true if outside, false otherwise
         */
        is_outside: function()
        {
            return JS.match_regex(
                window.location.hash,
                '^#outside\\?(?:go=outside\\/refresh;)?sk=[a-z0-9]{5}$'
            );
        },

        /**
         * Check if the given page is loaded (in or out of city).
         * @param string page The page to check (a key from pages_url_)
         * @return string true if on the selected page
         */
        is_on_page: function(page)
        {
            return (is_on_page_in_city(page) ||
                    is_on_page_out_of_city(page));
        },

        /**
         * Check if the given city page is loaded.
         * @param string page The page to check (a key from pages_url_)
         * @return string true if on the selected city page
         */
        is_on_page_in_city: function(page)
        {
            return JS.match_regex(
                window.location.hash,
                '^#city\\/enter\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
            ) || JS.match_regex(
                window.location.hash,
                '^#ghost\\/city\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
            );
        },

        /**
         * Check if the given page is loaded (not in city).
         * @param string page The page to check (a key from pages_url_)
         * @return string true if on the selected page (not in city)
         */
        is_on_page_out_of_city: function(page)
        {
            return JS.match_regex(
                window.location.hash,
                '^#ghost\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
            );
        },

        /**
         * Load a specific city page.
         * @param string page The page to go (a key from pages_url_)
         */
        go_to_city_page: function(page)
        {
            // if not in a town, outside city or already on the page, abort
            is_in_town(function(in_town) {
                if (!(in_town ||
                      is_outside() ||
                      is_on_page_in_city(page)
                     )) {
                    return;
                }

                get_sk(function(sk) {
                    var page_url = pages_url_[page];

                    if (is_on_forum()) { // if on the forum, redirect to the desired page
                        JS.redirect('/#city/enter?go=' + page_url + ';sk=' + sk);
                    } else { // else just download the content with an ajax request
                        JS.injectJS('JS.XmlHttp.get(' + JSON.stringify(page_url + '?sk=' + sk) + ');');
                    }
                });
            });
        },

        /**
         * Find the sk (session/secret key?).
         * @param callback callback The function to call once the sk is fetched
         */
        get_sk: function(callback)
        {
            JS.wait_for_selector('a.mainButton.newsButton', function(node) {
                var arr = node.href.split('=');

                // return string after the last equal which should be the session
                // key
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
         * Add custom events on the interface:
         * - to watch when the gamebody is reloaded: 'd2n_gamebody_reload'
         * - to watch the number of AP: 'd2n_apchange'
         */
        add_custom_events: function()
        {
            /*
             * Gamebody
             */

            // Emit Gamebody reloaded event
            var emit_gamebody_reloaded_event = function() {
                document.dispatchEvent(new CustomEvent(
                    'd2n_gamebody_reload', {
                        bubbles: true,
                        cancelable: true
                    }
                ));
            };

            var watch_for_gamebody_reload = function(limit) {
                limit = (typeof limit === 'undefined') ? 20 : limit;

                // If the limit isn't reached and the hash isn't defined, call this
                // function again (this is done to wait the first load)
                if (limit > 0 && window.location.hash === '') {
                    return setTimeout(function() { watch_for_gamebody_reload(limit - 1); }, 200);
                }

                JS.wait_for_tag('body', function(nodes) {
                    var body_observer = new MutationObserver(function(mutations) {
                        for (var i = 0, max = mutations.length; i < max; ++i) {
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

            /*
             * AP
             */

            // only watch AP change in town
            is_in_town(function(in_town) {
                if (in_town) {

                    // Emit AP change event
                    var emit_ap_change_event = function() {
                        document.dispatchEvent(new CustomEvent(
                            'd2n_apchange', {
                                bubbles: true,
                                cancelable: true
                            }
                        ));
                    };

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
        },

        /**
         * Return the hostname of the current webpage.
         */
        get_website: function()
        {
            return window.location.hostname;
        }

    };

})();
