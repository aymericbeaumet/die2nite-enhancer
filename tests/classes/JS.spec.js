describe("JS.network_request", function() {
});

describe("JS.is_defined", function() {
    it("should return false if the parameter undefined", function() {
        expect(JS.is_defined(undefined)).toBe(false);
    });

    it("should return false if the parameter null", function() {
        expect(JS.is_defined(null)).toBe(false);
    });

    it("should return true if the parameter integer 0", function() {
        expect(JS.is_defined(0)).toBe(true);
    });

    it("should return true if the parameter empty string", function() {
        expect(JS.is_defined("")).toBe(true);
    });

    it("should return true if the parameter empty array", function() {
        expect(JS.is_defined([])).toBe(true);
    });

    it("should return true if the parameter empty object", function() {
        expect(JS.is_defined({})).toBe(true);
    });

    it("should return true if the parameter closure", function() {
        expect(JS.is_defined(function(){})).toBe(true);
    });
});
