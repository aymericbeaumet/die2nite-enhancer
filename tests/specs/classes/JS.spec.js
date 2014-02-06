(function() {

    "use strict";

    // TODO: find a way to test with safari (-> fixture ?)
    describe("JS.network_request", function() {
        var method = "GET",
            url = window.location.protocol + "//" + window.location.host,
            urn = "/base/tests/bootstrap.js", // random file, the test will be done based on its content
            bad_urn = "/i/want/to/hit/a/404",
            request_timeout = 500, // ms
            callback_success, callback_failure;

        describe("[XMLHttpRequest]", function() {
            var reference_content = $.ajax({
                type: method,
                url: urn,
                async: false
            }).responseText;

            /**
             * Used to perform network request.
             * @param string method GET, POST, etc...
             * @param string urn Where does the request have to be performed?
             * @param boolean expect_success Is it supposed to be a success?
             */
            var test_xml_http_request = function(method, urn, expect_success) {
                var flag = false;

                runs(function() {
                    JS.network_request(method, urn, "", {},
                       function(content) {
                           flag = true;
                           callback_success(content);
                       },
                       function() {
                           flag = true;
                           callback_failure();
                       }
                    );
                });

                waitsFor(function() {
                    return flag === true;
                }, "the network request to answer (positively or nagatively)", request_timeout);

                runs(function() {
                    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
                    if (expect_success) {
                        expect(callback_success).toHaveBeenCalledWith(reference_content);
                        expect(callback_failure).not.toHaveBeenCalled();
                    } else {
                        expect(callback_success).not.toHaveBeenCalled();
                        expect(callback_failure).toHaveBeenCalled();
                    }
                });
            };

            beforeEach(function() {
                spyOn(XMLHttpRequest.prototype, "send").andCallThrough();
                callback_success = jasmine.createSpy("callback_success");
                callback_failure = jasmine.createSpy("callback_failure");
            });

            afterEach(function() {
                callback_success = null;
                callback_failure = null;
            });

            describe("should success on a valid", function() {
                describe("HTTP GET request", function() {
                    it("(URN).", function() {
                        test_xml_http_request(method, urn, true);
                    });

                    it("(URL + URN).", function() {
                        test_xml_http_request(method, url + urn, true);
                    });
                });
            });

            describe("should fail on a non-valid", function() {
                describe("HTTP GET request", function() {
                    it("(URN).", function() {
                        test_xml_http_request(method, bad_urn, false);
                    });

                    it("(URL + URN).", function() {
                        test_xml_http_request(method, url + bad_urn, false);
                    });
                });
            });
        });

        describe("[GM_xmlhttpRequest]", function() {
            beforeEach(function() {
                window.GM_xmlhttpRequest = jasmine.createSpy("GM_xmlhttpRequest");
            });

            afterEach(function() {
                window.GM_xmlhttpRequest = null;
                delete window.GM_xmlhttpRequest;
            });

            it("should call the GreaseMonkey helper", function() {
                JS.network_request(method, urn, "", {}, function(){}, function(){});

                expect(window.GM_xmlhttpRequest).toHaveBeenCalled();

                var args = window.GM_xmlhttpRequest.mostRecentCall.args;
                expect(args[0].method).toBe(method);
                expect(args[0].url).toBe(JS.form_uri(null, urn));
            });
        });
    });



    describe("JS.is_defined", function() {
        describe("should return false if", function() {
            it("the parameter is null.", function() {
                expect(JS.is_defined(null)).toBe(false);
            });

            it("the parameter is undefined.", function() {
                expect(JS.is_defined(undefined)).toBe(false);
            });
        });

        describe("should return true if", function() {
            it("the parameter is a string.", function() {
                expect(JS.is_defined("")).toBe(true);
            });

            it("the parameter is a number.", function() {
                expect(JS.is_defined(0)).toBe(true);
            });

            it("the parameter is a boolean.", function() {
                expect(JS.is_defined(false)).toBe(true);
            });

            it("the parameter is an array.", function() {
                expect(JS.is_defined([])).toBe(true);
            });

            it("the parameter is an object.", function() {
                expect(JS.is_defined({})).toBe(true);
            });

            it("the parameter is a closure.", function() {
                expect(JS.is_defined(function(){})).toBe(true);
            });

            it("the parameter is a regular expression.", function() {
                expect(JS.is_defined(/regexp/)).toBe(true);
            });
        });
    });



    describe("JS.reset_previous_keycode", function() {
        afterEach(function() {
            JS.reset_previous_keycode();
        });

        it("should permit two sequential keydown_event calls without a memorised keystroke", function() {
            var callback = jasmine.createSpy("callback");
            var keycode = 65; // 'A'

            JS.keydown_event(callback, 500);
            expect(callback).not.toHaveBeenCalled();

            $(document).simulate("keydown", {
                keyCode: keycode
            });
            expect(callback).toHaveBeenCalledWith(keycode, null);

            JS.reset_previous_keycode();

            $(document).simulate("keydown", {
                keyCode: keycode
            });
            expect(callback).toHaveBeenCalledWith(keycode, null);
        });
    });



    describe("JS.keydown_event", function() {
        var callback;
        var keycode = 65; // 'A'
        var timeout = 25; // ms

        beforeEach(function() {
            callback = jasmine.createSpy("callback");
            JS.keydown_event(callback, timeout);
        });

        afterEach(function() {
            JS.reset_previous_keycode();
            callback = null;
        });

        describe("should have called the callback with", function() {
            it("keycode and null.", function() {
                $(document).simulate("keydown", {
                    keyCode: keycode
                });
                expect(callback).toHaveBeenCalledWith(keycode, null);
            });

            it("keycode_1 and keycode_2.", function() {
                $(document).simulate("keydown", {
                    keyCode: keycode
                });
                expect(callback).toHaveBeenCalledWith(keycode, null);

                $(document).simulate("keydown", {
                    keyCode: (keycode + 1) // 'B'
                });
                expect(callback).toHaveBeenCalledWith((keycode + 1), keycode);
            });
        });

        describe("should have not called the callback if the event was emitted from a", function() {
            it("text input.", function() {
                loadFixtures("generic/input_text.html");
                $("#input_text").simulate("keydown", {
                    keyCode: keycode
                });
                expect(callback).not.toHaveBeenCalled();
            });

            it("textarea input.", function() {
                loadFixtures("generic/input_textarea.html");
                $("#input_textarea").simulate("keydown", {
                    keyCode: keycode
                });
                expect(callback).not.toHaveBeenCalled();
            });
        });

    });



    describe("JS.injectCSS", function() {
        var to_be_injected = "/* You are not your resume, you are your work. */";
        var injected;

        beforeEach(function() {
            JS.injectCSS(to_be_injected);
            injected = $("head > style:last-of-type");
        });

        afterEach(function() {
            injected.remove();
        });

        it("should have injected the CSS.", function() {
            expect(injected.text()).toBe(to_be_injected);
        });
    });



    describe("JS.injectJS", function() {
        describe("should have inserted", function() {
            var proof_variable_key = "proof_variable";
            var proof_variable_content = "Build a ship before you burn a bridge.";

            beforeEach(function() {
                window[proof_variable_key] = null;
            });

            afterEach(function() {
                delete window[proof_variable_key];
            });

            it("the string as is.", function() {
                var to_be_inserted = "window['" + proof_variable_key + "'] = '" + proof_variable_content + "'";
                JS.injectJS(to_be_inserted);
                expect(window[proof_variable_key]).toBe(proof_variable_content);
            });

            it("the string as an auto-called closure.", function() {
                var to_be_inserted = function() {
                    // values are hard-coded because it is interpreted at execution (in the page context)
                    window.proof_variable = "Build a ship before you burn a bridge.";
                };
                JS.injectJS(to_be_inserted);
                expect(window[proof_variable_key]).toBe(proof_variable_content);
            });
        });
    });



    describe("JS.remove_DOM_node", function() {
        it("should have removed the DOM node.", function() {
            loadFixtures("generic/simple_div.html");
            var id_to_delete = "simple_div";

            expect($("#" + id_to_delete)).toBeInDOM();
            JS.remove_DOM_node(document.getElementById(id_to_delete));
            expect($("#" + id_to_delete)).not.toBeInDOM();
        });
    });



    describe("JS.merge", function() {
        var object1 = {
            a: {
                aa: {
                    aaa: "content",
                    aab: "will be replaced"
                }
            }
        };

        var object2 = {
            a: {
                aa: {
                    aab: "replace"
                },
                ab: {
                    aba: "content"
                }
            },
            b: {
                bb: "content"
            }
        };

        var merged_object_ref = {
            a: {
                aa: {
                    aaa: "content",
                    aab: "replace"
                },
                ab: {
                    aba: "content"
                }
            },
            b: {
                bb: "content"
            }
        };

        it("should have merge this two objects.", function() {
            var merged_object = JS.merge(object1, object2);
            expect(merged_object).toEqual(merged_object_ref);
        });
    });



    describe("JS.wait_for_", function() {
        var found_callback;
        var not_found_callback;
        var timeout = 1000;

        var types = {
            id: {
                fixture: "generic/simple_div.html",
                get_query_func: function() { return JS.wait_for_id; },
                query: "simple_div",
                match: function(q) { return document.getElementById(q); }
            },
            class_: {
                fixture: "generic/simple_div.html",
                get_query_func: function() { return JS.wait_for_class; },
                query: "simple_div",
                match: function(q) { return document.getElementsByClassName(q); }
            },
            tag: {
                fixture: "generic/simple_video.html", // the tag must not be used anywhere else
                get_query_func: function() { return JS.wait_for_tag; },
                query: "video",
                match: function(q) { return document.getElementsByTagName(q); }
            },
            selector: {
                fixture: "generic/simple_div.html",
                get_query_func: function() { return JS.wait_for_selector; },
                query: "div#simple_div",
                match: function(q) { return document.querySelector(q); }
            },
            selector_all: {
                fixture: "generic/simple_div.html",
                get_query_func: function() { return JS.wait_for_selector_all; },
                query: "div#simple_div",
                match: function(q) { return $.makeArray(document.querySelectorAll(q)); }
            }
        };

        beforeEach(function() {
            found_callback = jasmine.createSpy("found_callback");
            not_found_callback = jasmine.createSpy("not_found_callback");
        });

        afterEach(function() {
            found_callback = null;
            not_found_callback = null;
        });

        var test_type = function(name, data) {
            describe(name, function() {
                it("should have found immediatly.", function() {
                    loadFixtures(data.fixture);

                    data.get_query_func()(data.query, found_callback, 0, not_found_callback);
                    expect(found_callback).toHaveBeenCalledWith(data.match(data.query));
                    expect(not_found_callback).not.toHaveBeenCalled();
                });

                it("should have found after one recursion.", function() {
                    var flag = false;

                    runs(function() {
                        data.get_query_func()(data.query, function(el) {
                            found_callback(el);
                            flag = true;
                        }, 1, function() {
                            not_found_callback();
                            flag = true;
                        });
                        loadFixtures(data.fixture);
                    });

                    waitsFor(function() {
                        return flag === true;
                    }, "the function to find in less than 2 retries", timeout);

                    runs(function() {
                        expect(found_callback).toHaveBeenCalledWith(data.match(data.query));
                        expect(not_found_callback).not.toHaveBeenCalled();
                    });
                });

                it("should not have found.", function() {
                    data.get_query_func()(data.query, found_callback, 0, not_found_callback);
                    expect(found_callback).not.toHaveBeenCalled();
                    expect(not_found_callback).toHaveBeenCalled();
                });

                it("should not have found after one recursion.", function() {
                    var flag = false;

                    runs(function() {
                        data.get_query_func()(data.query, function(el) {
                            found_callback(el);
                            flag = true;
                        }, 1, function() {
                            not_found_callback();
                            flag = true;
                        });
                    });

                    waitsFor(function() {
                        return flag === true;
                    }, "the function to find in less than 2 retries", timeout);

                    runs(function() {
                        expect(found_callback).not.toHaveBeenCalled();
                        expect(not_found_callback).toHaveBeenCalled();
                    });
                });
            });
        };

        for (var type in types) {
            if (types.hasOwnProperty(type)) {
                test_type(type, types[type]);
            }
        }
    });



    describe("JS.redirect", function() {
        // TODO: Cannot test it as it is just a window.location.href assignment.
    });



    describe("JS.reload", function() {
        // TODO: Cannot test it as it is just a location.reload() call.
    });



    describe("JS.regex_test", function() {
        var string = "I have nothing to declare but my genius.";

        describe("should match with a correct pattern given as a", function() {
            var regex = "^I have nothing";

            it("string", function() {
                var ret = JS.regex_test(regex, string);
                expect(ret).toBe(true);
            });

            it("RegExp object", function() {
                var ret = JS.regex_test(new RegExp(regex), string);
                expect(ret).toBe(true);
            });
        });

        describe("should not match with a non-correct pattern given as", function() {
            var regex = "^I have nothing$";

            it("string", function() {
                var ret = JS.regex_test(regex, string);
                expect(ret).toBe(false);
            });

            it("RegExp object", function() {
                var ret = JS.regex_test(new RegExp(regex), string);
                expect(ret).toBe(false);
            });
        });
    });



    describe("JS.each", function() {
        it("should iterate over an object", function() {
            var callback = jasmine.createSpy("callback");
            var obj = {
                a: "content_a",
                b: "content_b",
                c: "content_c",
                d: "content_d"
            };

            JS.each(obj, function(key, value) {
                expect(obj[key]).toBe(value);
                callback();
            });
            expect(callback.calls.length).toBe(Object.keys(obj).length);
        });
    });



    describe("JS.dispatch_event", function() {
        var event_name = "this_is_a_custom_event";
        var event_detail = { jasmine: true };
        var callback;
        var node;

        beforeEach(function() {
            loadFixtures("generic/simple_div.html");
            callback = jasmine.createSpy("callback");
            node = document.getElementById("simple_div");
            node.addEventListener(event_name, callback);
        });

        afterEach(function() {
            node.removeEventListener(event_name, callback);
            node = null;
            callback = null;
        });

        it("should dispatch an event on the given node", function() {
            JS.dispatch_event(event_name, event_detail, node);
            expect(callback).toHaveBeenCalled();
            expect(callback.mostRecentCall.args[0].detail.jasmine).toBe(event_detail.jasmine);
        });
    });



    describe("JS.assign_attribute", function() {
        it("should assign a value to the corresponding key in the given object", function() {
            var context = {};
            var key = "key";
            var value = "value";

            JS.assign_attribute.call(context, key, value);

            expect(context[key]).toBe(value);
        });
    });



    describe("JS.insert_after", function() {
        var new_node;
        var new_node_id = "new_node";
        var previous_node;

        beforeEach(function() {
            loadFixtures("generic/simple_div.html");

            previous_node = document.getElementById("simple_div");

            new_node = document.createElement("div");
            new_node.id = new_node_id;
        });

        afterEach(function() {
            $(new_node).remove();
        });

        it("should insert a node after another", function() {
            expect(document.getElementById(new_node_id)).toBeNull();

            JS.insert_after(document.getElementById("simple_div"), new_node);

            expect($(new_node)).toBeInDOM();
            expect(new_node.previousSibling).toBe(previous_node);
        });
    });



    describe("JS.parse_xml", function() {
        var xml = '<?xml version="1.0" encoding="UTF-8"?><note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don\'t forget me this weekend!</body></note>';

        // This function uses the native DOMParser, so I consider a non-null
        // return as a proof of success.
        it("should parse an XML string", function() {
            var ret = JS.parse_xml(xml);
            expect(ret).not.toBeNull();
        });
    });



    describe("JS.nodelist_to_array", function() {
        var nodelist = document.querySelectorAll('div');
        var array = $.makeArray(nodelist);

        it("should return an array from a nodelist", function() {
            var ret = JS.nodelist_to_array(nodelist);
            expect(JSON.stringify(ret)).toBe(JSON.stringify(array));
        });
    });



    describe("JS.form_uri", function() {
        it("should prefix with the URL for a relative URI", function() {
            expect(JS.form_uri(null, "/my_path")).
                toBe(window.location.protocol + "//" + window.location.host + "/my_path");
        });

        it("should not prefix with the URL for a complete URI", function() {
            expect(JS.form_uri(null, "https://github.com/new_path")).
                toBe("https://github.com/new_path");
        });

        it("should just concatenate the two parts if the URL is provided", function() {
            expect(JS.form_uri("https://google.com", "/plus")).
                toBe("https://google.com/plus");
        });
    });



    describe("JS.jsonToDOM", function() {
        var click_callback;
        var json;

        beforeEach(function() {
            loadFixtures("generic/simple_div.html");
            click_callback = jasmine.createSpy("click_callback");
            json = [
                "div", { id: "test_div", "class": "test_div", onclick: click_callback },
                    ["p", {}]
            ];
        });

        afterEach(function() {
            click_callback = null;
        });

        it("should create a DOM tree from a JavaScript object", function() {
            var dom = JS.jsonToDOM(json, document);

            $("#simple_div").append(dom);

            expect($("div#simple_div > div#test_div.test_div")).toBeInDOM();
            expect($("div#simple_div > div#test_div.test_div > p")).toBeInDOM();

            expect(click_callback).not.toHaveBeenCalled();
            $("#test_div").simulate("click");
            expect(click_callback).toHaveBeenCalled();
        });
    });



    describe("JS.is_cross_domain", function() {
        var page_protocol = window.location.protocol;
        var page_opposite_protocol = (page_protocol === "http:") ? "https:" : "http:";
        var page_host = window.location.host;

        it("should valid these tests as Cross Domain", function() {
            expect(JS.is_cross_domain("http://google.com")).toBe(true);
            expect(JS.is_cross_domain("https://github.com")).toBe(true);
            expect(JS.is_cross_domain(page_opposite_protocol + "//" + page_host)).toBe(true);
            expect(JS.is_cross_domain(page_opposite_protocol + "//" + page_host + "/test")).toBe(true);
        });

        it("should not valid these tests as Cross Domain", function() {
            expect(JS.is_cross_domain(page_protocol + "//" + page_host + "/test")).toBe(false);
            expect(JS.is_cross_domain("/test")).toBe(false);
        });
    });

})();
