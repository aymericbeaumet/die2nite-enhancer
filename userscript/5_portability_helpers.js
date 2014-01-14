/**
 * Portability helpers (on Chrome, GM, Opera, etc...)
 */

var portability = (function() { var self = {};

    /**
     * Execute an asynchronous network request.
     * @param string method
     * @param string url
     * @param string data
     * @param JSON headers
     * @param callback onsuccess in case of success
     * @param callback onfailure in case of failure
     * @param Object param An object given as an additional parameter to callbacks
     */
    self.network_request = function(method, url, data, headers, onsuccess, onfailure, param) {

        // Google Chrome script / GreaseMonkey
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            return GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                headers: headers,
                onload: function(r) { onsuccess(r.responseText, param); },
                onerror: function(r) { onfailure(param); }
            });
        }

        // Safari needs to dispatch the request to the global page
        if (typeof safari !== 'undefined') {
            safari.self.addEventListener('message', function(event) {
                switch (event.name) {
                    case 'network_request_succeed':
                        return onsuccess(event.message, param);

                    case 'network_request_failed':
                        return onfailure(param);
                }
            }, false);

            return safari.self.tab.dispatchMessage('do_network_request', {
                method: method,
                url: url,
                data: data,
                headers: headers
            });
        }

        // All other cases
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open(method, url, true);
        for (var header in headers) {
            xmlhttp.setRequestHeader(header, headers[header]);
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status >= 200 && xmlhttp.status < 300) {
                    return onsuccess(xmlhttp.responseText, param);
                }
                return onfailure(param);
            }
        };
        xmlhttp.send(data);
    };


    return self;
})();
