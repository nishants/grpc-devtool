const getServiceByEndpointId = require('../src/server/getServiceByEndpointId');
describe("getServiceByEndpointId.js", () => {
  it("Should get service by endpoint", () => {
    const expected = {id: "a-service-definition"};

    const definition = {helloworld: {greet: {Greeter : expected} }};
    const endpoint = {getService : ()=> "helloworld.greet.Greeter"};
    const actual = getServiceByEndpointId.get({definition,  endpoint});

    expect(actual).toBe(expected)
  });
});