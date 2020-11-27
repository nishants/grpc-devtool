const config = require('../src/config');

describe("config", () => {
  describe("keywords", () => {
    test("should identify keywords with default symbol", () => {
      expect(config.isKeyWord("any@", "any")).toBe(true);
      expect(config.isKeyWord("any@a", "any")).toBe(false);
      expect(config.isKeyWord("aany@", "any")).toBe(false);
      expect(config.isKeyWord("any@@", "any")).toBe(false);
    });
  });
});