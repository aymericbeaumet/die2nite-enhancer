/******************************************************************************
 *                                                                            *
 *  JavaScript helpers class                                                  *
 *                                                                            *
 ******************************************************************************/

var JS = (function() {

/*
 * private:
 */

    /**
     * Time to wait between two self-call of wait_for_* functions
     */
    var wait_for_retry_time_ = 500; //ms

    /**
     * Safely insert code through JSON.
     * @link https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion
     */
    var jsonToDOM = function(xml, doc, nodes)
    {
        function namespace(name) {
            var m = /^(?:(.*):)?(.*)$/.exec(name);
            return [jsonToDOM.namespaces[m[1]], m[2]];
        }

        function tag(name, attr) {
            if (Array.isArray(name)) {
                var frag = doc.createDocumentFragment();
                Array.forEach(arguments, function (arg) {
                    if (!Array.isArray(arg[0])) {
                        frag.appendChild(tag.apply(null, arg));
                    } else {
                        arg.forEach(function (arg) {
                            frag.appendChild(tag.apply(null, arg));
                        });
                    }
                });
                return frag;
            }

            var args = Array.prototype.slice.call(arguments, 2);
            var vals = namespace(name);
            var elem = doc.createElementNS(vals[0] || jsonToDOM.defaultNamespace, vals[1]);

            for (var key in attr) {
                if (attr.hasOwnProperty(key)) {
                    var val = attr[key];
                    if (nodes && key === "key") {
                        nodes[val] = elem;
                    }

                    vals = namespace(key);
                    if (typeof val === "function") {
                        elem.addEventListener(key.replace(/^on/, ""), val, false);
                    } else {
                        elem.setAttributeNS(vals[0] || "", vals[1], val);
                    }
                }
            }
            args.forEach(function(e) {
                elem.appendChild(typeof e === "object" ? tag.apply(null, e) :
                                 e instanceof Node    ? e : doc.createTextNode(e));
            });
            return elem;
        }
        return tag.apply(null, xml);
    };
    jsonToDOM.namespaces = {
        html: "http://www.w3.org/1999/xhtml",
        xul: "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"
    };
    jsonToDOM.defaultNamespace = jsonToDOM.namespaces.html;

    var keydown_event_ = {
        previous_keycode: 0,
        previous_keycode_timestamp: 0,
    };

/*
 * public:
 */

    return {

        /**
         * Execute an asynchronous network request.
         * @param string method POST, GET...
         * @param string urn path
         * @param string data query string
         * @param JSON headers
         * @param callback on_success in case of success
         * @param callback on_failure in case of failure
         */
        network_request: function(method, urn, data, headers, on_success, on_failure) {

            var uri;

            // if the URL (protocol + domain) is missing, add it to form the URI
            if (/^\/[^\/].+$/.test(urn)) {
                uri = window.location.protocol + '//' + window.location.host + urn;
            } else { // just use the given URN as the URI
                uri = urn;
            }

            // Google Chrome script / GreaseMonkey
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                return new GM_xmlhttpRequest({
                    method: method,
                    url: uri,
                    data: '' + data,
                    headers: headers,
                    onload: function(r) { on_success(r.responseText); },
                    onerror: function(r) { on_failure(); }
                });
            }

            // Safari needs to dispatch the request to the global page
            if (typeof safari !== 'undefined') {
                safari.addEventListener('message', function(event) {
                    switch (event.name) {
                        case 'network_request_succeed':
                            return on_success(event.message);

                        case 'network_request_failed':
                            return on_failure();
                    }
                }, false);

                return safari.tab.dispatchMessage('do_network_request', {
                    method: method,
                    url: uri,
                    data: '' + data,
                    headers: headers
                });
            }

            // All other cases
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open(method, uri, true);
            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    xmlhttp.setRequestHeader(header, headers[header]);
                }
            }
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                        return on_success(xmlhttp.responseText);
                    }
                    return on_failure();
                }
            };
            xmlhttp.send(data);
        },

        /**
         * Check if a given variable is defined and is not null.
         * @param mixed variable The variable to check
         * @return bool true if the variable is defined and is not null, otherwise
         * false
         */
        is_defined: function(variable)
        {
            return (typeof variable !== 'undefined' && variable !== null);
        },

        /**
         * Catch a keydown event (abort if the cursor is in an input field). Call
         * the callback `callback` with the current keycode and the last one (if it
         * exists).
         * @param callback callback The function to call, should look like the
         * following prototype: `function(keycode, previous_keycode){};`.
         * previous_keycode will be null if it doesn't exists.
         * @param integer time_limit The maximum amount of time (in ms) to wait
         * between two binds.
         * @param DOMNode node The DOM node to listen on
         */
        keydown_event: function(callback, time_limit, node)
        {
            // defaut 1000ms between two key strokes
            time_limit = time_limit || 1000;
            node = node || document;

            node.addEventListener('keydown', function(event) {
                // Cancel event if the cursor is in an input field or textarea
                if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') {
                    return;
                }

                // Cancel event if elapsed time is too long between two key strokes
                if (event.timeStamp - keydown_event_.previous_keycode_timestamp > time_limit) {
                    keydown_event_.previous_keycode = null;
                }

                // Invoke callback
                callback(event.keyCode, keydown_event_.previous_keycode);

                // Save keycode
                keydown_event_.previous_keycode = event.keyCode;
                keydown_event_.previous_keycode_timestamp = event.timeStamp;
            }, false);
        },

        /**
         * Inject CSS code in the page context.
         * @param string code The CSS code to inject
         */
        injectCSS: function(code)
        {
            var css = document.createElement('style');
            css.setAttribute('type', 'text/css');
            css.textContent = code;

            JS.wait_for_tag('head', function(nodes) {
                nodes[0].appendChild(css);
            });
        },

        /**
         * Inject and execute JavaScript code in the page context.
         * @link http://wiki.greasespot.net/Content_Script_Injection
         * @param string/callback source The JS code to inject
         */
        injectJS: function(source)
        {
            // Check for function input.
            if ('function' === typeof source) {
                // Execute this function with no arguments, by adding parentheses.
                // One set around the function, required for valid syntax, and a
                // second empty set calls the surrounded function.
                source = '(' + source + ')();';
            }

            // Create a script node holding this  source code.
            var script = document.createElement('script');
            script.setAttribute('type', 'application/javascript');
            script.textContent = source;

            // Insert the script node into the page, so it will run, and immediately
            // remove it to clean up.
            JS.wait_for_selector('html > body', function(node) {
                node.appendChild(script);
                node.removeChild(script);
            });
        },

        /**
         * Remove an DOM node.
         * @link http://stackoverflow.com/a/14782/1071486
         * @param DOMNode node The DOM node to delete
         */
        remove_DOM_node: function(node)
        {
            if (JS.is_defined(node)) {
                node.parentNode.removeChild(node);
            }
        },

        /*
         * Recursively merge properties of 2 objects. The first object properties
         * will be erased by the second ones.
         * @link http://stackoverflow.com/a/383245/1071486
         * @param Object obj1 The first object which will receive the merge
         * @param Object obj2 The second object to merge
         * @return Object The first object
         */
        merge: function(obj1, obj2) {
            for (var p in obj2) {
                if (obj2.hasOwnProperty(p)) {
                    try {
                        // Property in destination object set; update its value.
                        if (obj2[p].constructor === Object) {
                            obj1[p] = JS.merge(obj1[p], obj2[p]);
                        } else {
                            obj1[p] = obj2[p];
                        }
                    } catch(e) {
                        // Property in destination object not set; create it and set
                        // its value.
                        obj1[p] = obj2[p];
                    }
                }
            }

            return obj1;
        },

        /**
         * Execute a callback when a node with the given $id is found.
         * @param string id The id to search
         * @param callback callback The function to call when a result is found
         * @param integer max The maximum number of try
         * @param callback not_found_callback The function called if the element
         *                                    isn't found
         */
        wait_for_id: function(id, callback, max, not_found_callback)
        {
            max = max || 15;

            var el;

            // if max is defined and is reached, stop research
            if (max <= 0) {
                // if a callback has been given, call it
                if (JS.is_defined(not_found_callback) && typeof not_found_callback === 'function') {
                    not_found_callback();
                }
                return;
            }

            // else try to find it
            el = document.getElementById(id);
            if (JS.is_defined(el)) {
                return callback(el);
            }

            // if not, retry again
            setTimeout(function() {
                JS.wait_for_id(id, callback, max - 1, not_found_callback);
            }, wait_for_retry_time_);
        },

        /**
         * Execute a callback with the first node matching the given selector.
         * @param string selector The selector to execute
         * @param callback callback The function to call when a result is found
         * @param integer max The maximum number of try
         * @param callback not_found_callback The function called if the element
         *                                    isn't found
         */
        wait_for_selector: function(selector, callback, max, not_found_callback)
        {
            max = max || 15;

            var el;

            // if max is defined and is reached, stop research
            if (max <= 0) {
                // if a callback has been given, call it
                if (JS.is_defined(not_found_callback) && typeof not_found_callback === 'function') {
                    not_found_callback();
                }
                return;
            }

            // else try to find it
            el = document.querySelector(selector);
            if (JS.is_defined(el)) {
                return callback(el);
            }

            // if not, retry again
            setTimeout(function() {
                JS.wait_for_selector(selector, callback, max - 1, not_found_callback);
            }, wait_for_retry_time_);
        },

        /**
         * Execute a callback with an array containing all the nodes matching the
         * given selector.
         * @param string selector The selector to execute
         * @param callback callback The function to call when a result is found
         * @param integer max The maximum number of try
         * @param callback not_found_callback The function called if the element
         *                                    isn't found
         */
        wait_for_selector_all: function(selector, callback, max, not_found_callback)
        {
            max = max || 15;

            var el;

            // if max is defined and is reached, stop research
            if (max <= 0) {
                // if a callback has been given, call it
                if (JS.is_defined(not_found_callback) && typeof not_found_callback === 'function') {
                    not_found_callback();
                }
                return;
            }

            // else try to find it
            el = document.querySelectorAll(selector);
            if (JS.is_defined(el) && el.length > 0) {
                return callback(el);
            }

            // if not, retry again
            setTimeout(function() {
                JS.wait_for_selector_all(selector, callback, max - 1, not_found_callback);
            }, wait_for_retry_time_);
        },

        /**
         * Execute a callback with an array containing all the nodes matching the
         * given tag.
         * @param string tag The tag to search
         * @param callback callback The function to call when a result is found
         * @param integer max The maximum number of try
         * @param callback not_found_callback The function called if the element
         *                                    isn't found
         */
        wait_for_tag: function(tag, callback, max, not_found_callback)
        {
            max = max || 15;

            var el;

            // if max is defined and is reached, stop research
            if (max <= 0) {
                // if a callback has been given, call it
                if (JS.is_defined(not_found_callback) && typeof not_found_callback === 'function') {
                    not_found_callback();
                }
                return;
            }

            // else try to find it
            el = document.getElementsByTagName(tag);
            if (JS.is_defined(el) && el.length > 0) {
                return callback(el);
            }

            // if not, retry again
            setTimeout(function() {
                JS.wait_for_tag(tag, callback, max - 1, not_found_callback);
            }, wait_for_retry_time_);
        },

        /**
         * Execute a callback with an array containing all the nodes matching the
         * given class.
         * @param string class The class to search
         * @param callback callback The function to call when a result is found
         * @param integer max The maximum number of try
         * @param callback not_found_callback The function called if the element
         *                                    isn't found
         */
        wait_for_class: function(class_name, callback, max, not_found_callback)
        {
            max = max || 15;

            var el;

            // if max is defined and is reached, stop research
            if (max <= 0) {
                // if a callback has been given, call it
                if (JS.is_defined(not_found_callback) && typeof not_found_callback === 'function') {
                    not_found_callback();
                }
                return;
            }

            // else try to find it
            el = document.getElementsByClassName(class_name);
            if (JS.is_defined(el) && el.length > 0) {
                return callback(el);
            }

            // if not, retry again
            setTimeout(function() {
                JS.wait_for_class(class_name, callback, max - 1, not_found_callback);
            }, wait_for_retry_time_);
        },

        /**
         * Redirect to the given urn.
         * @param string urn The URN to redirect to
         */
        redirect: function(urn)
        {
            var url = window.location.protocol + '//' + window.location.host;
            var uri = url + urn;

            window.location.href = uri;
        },

        /**
         * Reload the current page.
         */
        reload: function()
        {
            location.reload();
        },

        /**
         * Instanciate a Regex object and test to see if the given string matches
         * it. Useful when the Regex should be constructed from a string.
         * @param string/RegExp The regex to match the string with
         * @param string The string to test
         * @return bool true if the regex matches the string, false otherwise
         */
        regex_test: function(regex, string)
        {
            var r;

            if (regex instanceof RegExp) {
                r = regex;
            } else {
                r = new RegExp(regex);
            }

            return r.test(string);
        },

        /**
         * Iterate over an object and pass the key/value to a callback.
         */
        each: function(object, callback)
        {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    callback(key, object[key]);
                }
            }
        },

        /**
         * Dispatch a custom event on the desired DOM Node
         * @param string key The event key
         * @param Object detail (optional) The event details
         * @param DOMNode node (optional) The node to dispatch the event on
         */
        dispatch_event: function(key, detail, node)
        {
            detail = detail || null;
            node = node || document;

            var event_param = {};
            event_param.detail = detail;
            event_param.bubbles = true;
            event_param.cancelable = true;

            node.dispatchEvent(new CustomEvent(key, event_param));
        },

        /**
         * Assign an attribute to the current object. This function is only
         * relevant if you call it by specifying a `this` context (with bind(),
         * call() or apply()).
         * @param string key The specific key where to assign the value
         * @param string value The value to store
         */
        assign_attribute: function(key, value)
        {
            this[key] = value;
        },

        /**
         * Insert a DOM node after another.
         * @link http://stackoverflow.com/a/4793630/1071486
         * @param Node reference_node
         * @param Node new_node
         */
        insert_after: function(reference_node, new_node)
        {
            reference_node.parentNode.insertBefore(new_node, reference_node.nextSibling);
        },

        /**
         * Parse a XML string.
         * @param string xml The XML to parse
         */
        parse_xml: function(xml)
        {
            var parser = new DOMParser();

            return parser.parseFromString(xml, "text/xml");
        },

        jsonToDOM: jsonToDOM

    };

})();
