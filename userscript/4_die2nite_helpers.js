/**
 * Die2Nite helpers
 */

var D2N_helpers = (function() {

/*
  public:
*/

    /**
     * Check if the player is on the forum.
     * @return bool true if on the forum, false otherwise
     */
    function is_on_forum()
    {
        return (window.location.pathname === '/tid/forum');
    }

    /**
     * Check if the user is playing in a town or not (do not confound with
     * `is_in_city`).
     * @return bool true if playing in a town, false otherwise
     */
    function is_in_town()
    {
        return js.is_defined(document.getElementById('clock'));
    }

    /**
     * Check if the player is in the city. Return false if the user is in the city
     * but on the forum.
     * @return bool true if inside the city, false otherwise
     */
    function is_in_city()
    {
        return js.match_regex(
            window.location.hash,
            '^#city'
        );
    }

    /**
     * Check if the player is outside the city. Return false if the user is
     * outside but on the forum.
     * @return string true if outside, false otherwise
     */
    function is_outside()
    {
        return js.match_regex(
            window.location.hash,
            '^#outside\\?(?:go=outside\\/refresh;)?sk=[a-z0-9]{5}$'
        );
    }

    /**
     * Check if the given page is loaded (in or out of city).
     * @param string page The page to check (a key from pages_url_)
     * @return string true if on the selected page
     */
    function is_on_page(page)
    {
        return (is_on_page_in_city(page) ||
                is_on_page_out_of_city(page));
    }

    /**
     * Check if the given city page is loaded.
     * @param string page The page to check (a key from pages_url_)
     * @return string true if on the selected city page
     */
    function is_on_page_in_city(page)
    {
        return js.match_regex(
            window.location.hash,
            '^#city\\/enter\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
        ) || js.match_regex(
            window.location.hash,
            '^#ghost\\/city\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
        );
    }

    /**
     * Check if the given page is loaded (not in city).
     * @param string page The page to check (a key from pages_url_)
     * @return string true if on the selected page (not in city)
     */
    function is_on_page_out_of_city(page)
    {
        return js.match_regex(
            window.location.hash,
            '^#ghost\\?go=' + pages_url_[page].replace('/', '\\/') + ';sk=[a-z0-9]{5}$'
        );
    }

    /**
     * Load a specific city page.
     * @param string page The page to go (a key from pages_url_)
     */
    function go_to_city_page(page)
    {
        // if not in a town, outside city or already on the page, abort
        if (!(is_in_town() ||
              D2N_helpers.is_outside() ||
              is_on_page_in_city(page))) {
            return;
        }

        get_sk(function(sk) {
            var page_url = pages_url_[page];

            if (is_on_forum()) { // if on the forum, redirect to the desired page
                js.redirect('/#city/enter?go=' + page_url + ';sk=' + sk);
            } else { // else just download the content with an ajax request
                // Note for AMO reviewer: this JS code calls a native function
                // on the website (js.XmlHttp.get), the `page_url` is a string
                // obtained from the const array `pages_url_`. `sk` is just the
                // session key.
                js.injectJS('js.XmlHttp.get(\'' + page_url + '?sk=' + sk + '\');');
            }
        });
    }

    /**
     * Find the sk (session/secret key?).
     * @param callback callback The function to call once the sk is fetched
     */
    function get_sk(callback)
    {
        js.wait_for_selector('a.mainButton.newsButton', function(node) {
            var arr = node.href.split('=');

            // return string after the last equal which should be the session
            // key
            callback(arr[arr.length - 1]);
        });
    }

    /**
     * Give the website language (specific to D2N/Hordes). Return 'en' by
     * default.
     * @return string The language of the current page ('en' / 'fr')
     * @return null if no corresponding language can be found
     */
    function get_website_language()
    {
        var hostname = window.location.hostname;

        if (js.is_defined(hostname) &&
            js.is_defined(websites_language_[hostname])) {
            return websites_language_[hostname];
        }

        return null;
    }

    /**
     * Call the given callback with the number of AP.
     * @param callback callback The function to call
     */
    function get_number_of_ap(callback)
    {
        js.wait_for_selector('#movesCounter > div', function(node) {
            var ap = parseInt(node.textContent.split('/')[0]);
            callback(ap);
        });
    }

    /**
     * Add custom events on the interface:
     * - to watch the hash in the URL: 'hashchange'
     * - to watch the number of AP: 'apchange'
     * - to watch when the gamebody is reloaded
     */
    function add_custom_events()
    {
        /*
         * Hash change
         */

        // Emit a hash change event
        var emit_hash_change_event = function() {
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

        // Emit an event while the first page load
        var watch_for_hash = function() {
            if (window.location.hash === '') {
                return setTimeout(function() { watch_for_hash(); }, 50);
            }
            emit_hash_change_event();
        };
        watch_for_hash();

        // Emit an event when the hash changes
        window.addEventListener('hashchange', function() {
            emit_hash_change_event();
        });

        // Emit an event when the loading wheel disappears
        var watch_for_page_load = function() {
            // Watch the hash on page load
            var observer = new MutationObserver(function(mutations) {
                for (var i = 0, max = mutations.length; i < max; ++i) {
                    // if the loading wheel disappears, then the page loading is
                    // done, emit a hash change event
                    if (mutations[i].target.style.display === 'none') {
                        emit_hash_change_event();
                        break;
                    }
                }
            });
            js.wait_for_id('loading_section', function(node) {
                observer.observe(node, { attributes: true });
            });
        };
        watch_for_page_load();

        // Loading wheel event: put it again if the gamebody is reloaded
        document.addEventListener('d2n_gamebody_reloaded', function() {
            watch_for_page_load();
        });

        /*
         * AP
         */

        // Emit AP change event
        var emit_ap_change_event = function() {
            get_number_of_ap(function(ap) {
                var event = new CustomEvent(
                    'd2n_apchange', {
                        detail: {
                            ap: ap
                        },
                        bubbles: true,
                        cancelable: true
                    }
                );
                document.dispatchEvent(event);
            });
        };

        if (is_in_town()) { // only watch AP in town
            // Emit an event when the AP changes
            var observer = new MutationObserver(function(mutations) {
                // Emit an event when the ap changes
                emit_ap_change_event();
            });
            js.wait_for_id('movesCounter', function(node) {
                observer.observe(node, {childList: true});
            });
        }

        /*
         * Gamebody
         */

        // Emit Gamebody reloaded event
        var emit_gamebody_reloaded_event = function() {
            var event = new CustomEvent(
                'd2n_gamebody_reloaded', {
                    detail: {},
                    bubbles: true,
                    cancelable: true
                }
            );
            document.dispatchEvent(event);
        };

        // Emit an event when the gamebody is reloaded
        var observer = new MutationObserver(function(mutations) {
            // Emit an event when the gamebody is reloaded
            emit_gamebody_reloaded_event();
        });
        js.wait_for_id('gamebody', function(node) {
            observer.observe(node, {childList: true});
        });
    }

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
*/

    return {
        is_on_forum: is_on_forum,
        is_in_town: is_in_town,
        is_in_city: is_in_city,
        is_outside: is_outside,
        is_on_page: is_on_page,
        is_on_page_in_city: is_on_page_in_city,
        is_on_page_out_of_city: is_on_page_out_of_city,
        go_to_city_page: go_to_city_page,
        get_sk: get_sk,
        get_website_language: get_website_language,
        get_number_of_ap: get_number_of_ap,
        add_custom_events: add_custom_events
    };

})();