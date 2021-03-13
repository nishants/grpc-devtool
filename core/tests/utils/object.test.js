const {getPathFromObject} = require('../../src/utils/objects');

describe("getServiceByEndpointId.js", () => {
  it("Should get service by endpoint", () => {
    const expected = {id: "a-service-definition"};

    const object = {helloworld: {greet: {Greeter : expected} }};
    const path = "helloworld.greet.Greeter";
    const actual = getPathFromObject({object, path});

    expect(actual).toBe(expected)
  });
});