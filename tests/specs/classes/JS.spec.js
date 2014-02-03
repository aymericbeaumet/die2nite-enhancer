(function() {

    "use strict";

    // TODO: find a way to test with GM_xmlhttpRequest and safari
    describe("JS.network_request", function() {
        var url = window.location.protocol + "//" + window.location.host;
        var urn = "/base/tests/bootstrap.js"; // random file, the test will be done based on its content
        var bad_urn = "/this/is/leading/to/nowhere";
        var request_timeout = 500; // ms
        var callback_success, callback_failure;

        var reference_content = $.ajax({
            type: "GET",
            url: urn,
            async: false
        }).responseText;

        /**
         * Used to perform network request.
         * @param string method GET, POST, etc...
         * @param string urn Where do the request should be performed?
         * @param boolean expect_success Should is it supposed to success?
         */
        var test_network_request = function(method, urn, expect_success) {
            var answer = false;

            runs(function() {
                JS.network_request(method, urn, "", {},
                   function(content) {
                       answer = true;
                       callback_success(content);
                   },
                   function() {
                       answer = true;
                       callback_failure();
                   }
                );
            });

            waitsFor(function() {
                return answer === true;
            }, "The network request took too much time", request_timeout);

            runs(function() {
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
            callback_success = jasmine.createSpy("callback_success");
            callback_failure = jasmine.createSpy("callback_failure");
        });

        afterEach(function() {
            callback_success = null;
            callback_failure = null;
        });

        describe("[XMLHttpRequest()]", function() {
            describe("should succeed on a valid", function() {
                describe("GET request", function() {
                    it("(URN)", function() {
                        test_network_request("GET", urn, true);
                    });

                    it("(URL + URN)", function() {
                        test_network_request("GET", url + urn, true);
                    });
                });
            });

            describe("should fail on a non-valid", function() {
                describe("GET request", function() {
                    it("(URN)", function() {
                        test_network_request("GET", bad_urn, false);
                    });

                    it("(URL + URN)", function() {
                        test_network_request("GET", url + bad_urn, false);
                    });
                });
            });
        });
    });



    describe("JS.is_defined", function() {
        describe("should return false if", function() {
            it("the parameter is null", function() {
                expect(JS.is_defined(null)).toBe(false);
            });

            it("the parameter is undefined", function() {
                expect(JS.is_defined(undefined)).toBe(false);
            });
        });

        describe("should return true if", function() {
            it("the parameter is a string", function() {
                expect(JS.is_defined("")).toBe(true);
            });

            it("the parameter is a number", function() {
                expect(JS.is_defined(0)).toBe(true);
            });

            it("the parameter is a boolean", function() {
                expect(JS.is_defined(false)).toBe(true);
            });

            it("the parameter is an array", function() {
                expect(JS.is_defined([])).toBe(true);
            });

            it("the parameter is an object", function() {
                expect(JS.is_defined({})).toBe(true);
            });

            it("the parameter is a closure", function() {
                expect(JS.is_defined(function(){})).toBe(true);
            });

            it("the parameter is a regular expression", function() {
                expect(JS.is_defined(/regexp/)).toBe(true);
            });
        });
    });



    describe("JS.keydown_event", function() {
        var callback;
        var node = document;
        var keycode = 65; // 'A'
        var timeout = 25; // ms

        beforeEach(function() {
            callback = jasmine.createSpy("callback");
            JS.keydown_event(callback, timeout, node); // call node.addEventListener on 'callback'
        });

        afterEach(function() {
            callback = null;
            node.removeEventListener("keydown", callback); // remove the callback added by the function
        });

        describe("should have called the callback with", function() {
            it("keycode and null", function() {
                $(node).simulate("keydown", {
                    keyCode: keycode
                });
                expect(callback).toHaveBeenCalledWith(keycode, null);
            });

            it("keycode and null", function() {
                // wait for the timeout to expire (polluted by the previous
                // test)
                setTimeout(function() {
                    $(node).simulate("keydown", {
                        keyCode: keycode
                    });
                    expect(callback).toHaveBeenCalledWith(keycode, null);

                    $(node).simulate("keydown", {
                        keyCode: (keycode + 1) // 'B'
                    });
                    expect(callback).toHaveBeenCalledWith((keycode + 1), keycode);
                }, timeout * 2);
            });
        });

        describe("should have not called the callback if the event was emitted from", function() {
            it("a text input", function() {
                loadFixtures("generic/input_text.html");
                $("#input_text").simulate("keydown", {
                    keyCode: keycode
                });
                expect(callback).not.toHaveBeenCalled();
            });

            it("a textarea input", function() {
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

        it("should have injected the CSS", function() {
            expect(injected.text()).toEqual(to_be_injected);
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

            it("the string as is", function() {
                var to_be_inserted = "window['" + proof_variable_key + "'] = '" + proof_variable_content + "'";
                JS.injectJS(to_be_inserted);
                expect(window[proof_variable_key]).toEqual(proof_variable_content);
            });

            it("the string as an auto-called closure", function() {
                var to_be_inserted = function() {
                    // values are hard-coded because it is interpreted at execution (in the page context)
                    window.proof_variable = "Build a ship before you burn a bridge.";
                };
                JS.injectJS(to_be_inserted);
                expect(window[proof_variable_key]).toEqual(proof_variable_content);
            });
        });
    });



    describe("JS.remove_DOM_node", function() {
        var id_to_delete = "I-am-a-unique-id";

        beforeEach(function() {
            // Create the DOM element
            var el_to_remove = $(document.createElement("div")).attr("id", id_to_delete);

            // Insert it in the DOM
            $("body").append(el_to_remove);
        });

        afterEach(function() {
            // Delete it (just in case)
            $("#" + id_to_delete).remove();
        });

        it("should have removed the DOM node", function() {
            expect($("#" + id_to_delete)).toBeInDOM();
            JS.remove_DOM_node(document.getElementById(id_to_delete));
            expect($("#" + id_to_delete)).not.toBeInDOM();
        });
    });

})();
