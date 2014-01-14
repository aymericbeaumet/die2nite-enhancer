/**
 * Generic JavaScript helpers
 */

var js = (function() { var self = {};

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
     * @param integer time_limit The maximum amount of time (in ms) to wait
     * between two binds.
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
        var css = document.createElement('style');
        css.setAttribute('type', 'text/css');
        css.textContent = code;

        self.wait_for_selector('html > head', function(node) {
            node.appendChild(css);
        });
    }

    /**
     * Inject and execute JavaScript code in the page context.
     * @link http://wiki.greasespot.net/Content_Script_Injection
     * @param string/callback source The JS code to inject
     */
    self.injectJS = function(source)
    {
        // Check for function input.
        if ('function' === typeof source) {
            // Execute this function with no arguments, by adding parentheses.
            // One set around the function, required for valid syntax, and a
            // second empty set calls the surrounded function.
            source = '(' + source + ')();'
        }

        // Create a script node holding this  source code.
        var script = document.createElement('script');
        script.setAttribute('type', 'application/javascript');
        script.textContent = source;

        // Insert the script node into the page, so it will run, and immediately
        // remove it to clean up.
        self.wait_for_selector('html > body', function(node) {
            node.appendChild(script);
            node.removeChild(script);
        });
    };

    /**
     * Remove an DOM node.
     * @link http://stackoverflow.com/a/14782/1071486
     * @param DOMNode node The DOM node to delete
     */
    self.remove_DOM_node = function(node) {
        if (self.is_defined(node)) {
            node.parentNode.removeChild(node);
        }
    };

    /*
     * Recursively merge properties of n objects. The first object properties
     * will be erased by the following one's.
     * @link http://stackoverflow.com/a/8625261/1071486
     * @param object... Some objects to merge.
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
     * Execute a callback when a node with the given $id is found.
     * @param string id The id to search
     * @param callback callback The function to call when a result is found
     */
    self.wait_for_id = function(id, callback) {
        var el;

        if (js.is_defined(el = document.getElementById(id))) {
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

    /**
     * Execute a callback with the first node matching the given selector.
     * @param string selector The selector to execute
     * @param callback callback The function to call when a result is found
     */
    self.wait_for_selector = function(selector, callback) {
        var el;

        if (js.is_defined(el = document.querySelector(selector))) {
            return callback(el);
        }
        setTimeout(function() {
            self.wait_for_selector(selector, callback);
        }, 50);
    };

    /**
     * Execute a callback with an array containing all the nodes matching the
     * given selector.
     * @param string selector The selector to execute
     * @param callback callback The function to call when a result is found
     */
    self.wait_for_selector_all = function(selector, callback) {
        var el;

        if (js.is_defined(el = document.querySelectorAll(selector))) {
            return callback(el);
        }
        setTimeout(function() {
            self.wait_for_selector_all(selector, callback);
        }, 50);
    };

    /**
     * Safely insert code through JSON.
     * @link https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion
     */
    jsonToDOM.namespaces = {
        html: "http://www.w3.org/1999/xhtml",
        xul: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    };
    jsonToDOM.defaultNamespace = jsonToDOM.namespaces.html;
    function jsonToDOM(xml, doc, nodes) {
        function namespace(name) {
            var m = /^(?:(.*):)?(.*)$/.exec(name);
            return [jsonToDOM.namespaces[m[1]], m[2]];
        }

        function tag(name, attr) {
            if (Array.isArray(name)) {
                var frag = doc.createDocumentFragment();
                Array.forEach(arguments, function (arg) {
                    if (!Array.isArray(arg[0]))
                        frag.appendChild(tag.apply(null, arg));
                    else
                        arg.forEach(function (arg) {
                            frag.appendChild(tag.apply(null, arg));
                        });
                });
                return frag;
            }

            var args = Array.prototype.slice.call(arguments, 2);
            var vals = namespace(name);
            var elem = doc.createElementNS(vals[0] || jsonToDOM.defaultNamespace,
                                           vals[1]);

            for (var key in attr) {
                var val = attr[key];
                if (nodes && key == "key")
                    nodes[val] = elem;

                vals = namespace(key);
                if (typeof val == "function")
                    elem.addEventListener(key.replace(/^on/, ""), val, false);
                else
                    elem.setAttributeNS(vals[0] || "", vals[1], val);
            }
            args.forEach(function(e) {
                elem.appendChild(typeof e == "object" ? tag.apply(null, e) :
                                 e instanceof Node    ? e : doc.createTextNode(e));
            });
            return elem;
        }
        return tag.apply(null, xml);
    }
    self.jsonToDOM = jsonToDOM;

    return self;
})();
