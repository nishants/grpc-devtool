const matchers = require('../../src/templateMatcher');

describe("matchers", ()=> {
  test("should create matcher for static json", () => {
    const definition = {
      name : "nishant",
      age: 34,
      location: "india"
    };

    const data = {
      name : "nishant",
      age: 34,
      location: "india"
    };

    const matcher = matchers.create({definition});

    const actual = matcher.matches(data);

    expect(actual).toBe(true);
  });

  test("should support any@ matcher", () => {
    const definition = {
      name : 'any@',
      age: 'any@',
      location: 'any@'
    };

    const data = {
      name : "nishant",
      age: 34,
      location: "india"
    };

    const matcher = matchers.create({definition});

    const actual = matcher.matches(data);

    expect(actual).toBe(true);
  });

  test("should support any!@ matcher", () => {
    const definition = {
      name : 'any!@',
    };

    const matcher = matchers.create({definition});

    expect(matcher.matches({name : null,})).toBe(false);
    expect(matcher.matches({name : "x",})).toBe(true);
  });

  describe("nested objects", () => {
    test("should create matcher for static json", () => {
      const definition = {
        name : "nishant",
        age: 34,
        info: {address: {location: "india"}}
      };

      const data = {
        name : "nishant",
        age: 34,
        info: {address: {location: "india", since: "2017"}}
      };

      const matcher = matchers.create({definition});

      const actual = matcher.matches(data);

      expect(actual).toBe(true);
    });

    test("should fail if sub object does not match", () => {
      const definition = {
        info: {address: {location: "india"}}
      };

      const data = {
        info: {address: {location: "us"}}
      };

      const matcher = matchers.create({definition});

      const actual = matcher.matches(data);

      expect(actual).toBe(false);
    });

    test("should apply matchers in nested objects for notnull", () => {
      const definition = {
        info: {address: {location: "any!@"}}
      };

      const data = {
        info: {address: {location: null}}
      };

      const matcher = matchers.create({definition});

      const actual = matcher.matches(data);

      expect(actual).toBe(false);
    });

    test("should apply matchers in nested objects", () => {
      const definition = {
        info: {address: {location: "any!@"}}
      };

      const data = {
        info: {address: {location: "us"}}
      };

      const matcher = matchers.create({definition});

      const actual = matcher.matches(data);

      expect(actual).toBe(true);
    });

  });

});