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
        get_sk(function(sk) {
            var page_url = pages_url_[page];

            // if already on the page, abort
            if (is_on_city_page(page)) {
                return;
            }

            if (is_on_forum()) { // if on the forum, redirect to the desired page
                js.redirect('/#city/enter?go=' + page_url + ';sk=' + sk);
            } else { // else just download the content with an ajax request
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
            return callback(arr[arr.length - 1]); // return last element
        });
    }

    /**
     * Give the website language (specific to D2N/Hordes). Return 'en' by
     * default.
     * @return string The language of the current page ('en' / 'fr')
     * @return string 'en' if no corresponding language can be found
     */
    function get_website_language()
    {
        var hostname = window.location.hostname;

        if (js.is_defined(hostname) &&
            js.is_defined(websites_language_[hostname])) {
            return websites_language_[hostname];
        }

        return 'en';
    }

    /**
     * Give the number of remaining AP. The div 'movesCounter' must be loaded.
     * @return integer The number of AP
     * @return null if an error occurs
     */
    function get_number_of_ap()
    {
        var el = document.querySelector('#movesCounter > div');

        if (js.is_defined(el)) {
            return el.textContent.split('>')[1].split('<')[0];
        }
        return null;
    }

    /**
     * Add custom events on the interface:
     * - to watch the hash in the URL: 'hashchange'
     * - to watch the number of AP: 'apchange'
     */
    function add_custom_events()
    {
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
        ghost_exp: 'ghost/heroUpgrades'
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
