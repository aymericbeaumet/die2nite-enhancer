(function() {

    "use strict";

    describe("JS.network_request", function() {
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
            node.removeEventListener(callback);
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

})();
