describe("JS.network_request", function() {
});

describe("JS.is_defined", function() {
    it("should return false if undefined", function() {
        expect(JS.is_defined(undefined)).toBe(false);
    });

    it("should return false if null", function() {
        expect(JS.is_defined(null)).toBe(false);
    });

    it("should return true if integer 0", function() {
        expect(JS.is_defined(0)).toBe(true);
    });

    it("should return true if empty string", function() {
        expect(JS.is_defined("")).toBe(true);
    });

    it("should return true if empty array", function() {
        expect(JS.is_defined([])).toBe(true);
    });

    it("should return true if empty object", function() {
        expect(JS.is_defined({})).toBe(true);
    });

    it("should return true if closure", function() {
        expect(JS.is_defined(function(){})).toBe(true);
    });
});
