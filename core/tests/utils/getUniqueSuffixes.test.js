const getUniqueSuffixes = require('../../src/utils/getUniqueSuffixes');

describe("getServiceByEndpointId.js", () => {
  it("Should get service by endpoint", () => {
    const values = [
      "abc.org.Service.Method1",
      "abc.org.Service.Method2",
      "abc.org.Service.Method3",
      "abc.org.Service.Method4",
    ];

    const expected = [
      "Method1",
      "Method2",
      "Method3",
      "Method4",
    ];

    const actual = getUniqueSuffixes(values)


    expect(actual).toEqual(expected)
  });

  it("should ignore empty array", () => {
    const values = [];

    const expected = [];

    const actual = getUniqueSuffixes(values)

    expect(actual).toEqual(expected)
  });

});