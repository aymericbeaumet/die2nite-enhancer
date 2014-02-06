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

})();
