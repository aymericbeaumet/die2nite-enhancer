(function() {

    "use strict";

    describe("Storage.set_key_prefix", function() {
        beforeEach(function() {
            Storage.key_prefix = null;
        });

        afterEach(function() {
            Storage.key_prefix = "";
        });

        describe("should set the key prefix to the given value", function() {
            it("if a string is given", function() {
                var key = "test";

                Storage.set_key_prefix(key);
                expect(Storage.key_prefix).toBe(key);
            });
        });

        describe("should not set the key prefix to the given value", function() {
            it("if a string is not given", function() {
                var key = {};

                Storage.set_key_prefix(key);
                expect(Storage.key_prefix).not.toBe(key);
            });
        });
    });



    describe("Storage.set", function() {
        var prefix = "test";

        beforeEach(function() {
            Storage.set_key_prefix(prefix);
            localStorage.clear();
        });

        afterEach(function() {
            Storage.set_key_prefix("");
            localStorage.clear();
        });

        it("should set the value in the local storage at the given 'prefix + key'", function() {
            var key = "Ugly key";
            var value = "Nice value!";

            expect(localStorage[prefix + key]).not.toBeDefined();
            Storage.set(key, value);
            expect(localStorage[prefix + key]).toBe(value);
        });
    });



    describe("Storage.get", function() {
        var prefix = "test",
            key = "Super key",
            value = "A value";

        beforeEach(function() {
            Storage.set_key_prefix(prefix);
            localStorage.clear();
        });

        afterEach(function() {
            Storage.set_key_prefix("");
            localStorage.clear();
        });

        it("should return the value for the given key", function() {
            localStorage[prefix + key] = value;

            expect(Storage.get(key)).toBe(value);
        });

        it("should return null if the key does not exist", function() {
            expect(Storage.get(key)).toBeNull();
        });
    });

})();
