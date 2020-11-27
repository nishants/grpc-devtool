const matchers = require('../../src/mapping/matchers');

describe("matchers", ()=> {
  test("should create matcher for static json", () => {
    const definition = {
      name : "nishant",
      age: 34,
      location: "india"
    };

    const matcher = matchers.create({definition});

    const actual = matcher.matches({...definition});

    expect(actual).toBe(true);
  });

  test("should support any@ matcher", () => {
    const definition = {
      name : 'any@',
      age: 'any@',
      male: 'any@',
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
});