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
            return el.textContent.split('>')[1].split('<')[0];
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
})();
