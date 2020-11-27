const matchers = require('../../src/mapping/matchers');

describe("matchers", ()=> {
  test("should create matcher for static json", () => {
    const definition = {
      name : "nishant",
      age: 34,
      location: "india"
    };

    const matcher = matchers.create({definition});

    const actual = matcher.match({...definition});

    expect(actual).toBe(true);
  });
});