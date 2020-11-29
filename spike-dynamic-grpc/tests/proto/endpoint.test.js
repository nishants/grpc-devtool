const {greetProto, pricesProto} = require('../helpers');

const analyzer = require('../../src/proto/proto-analyzer');

describe('endpoint.test.js', () => {
  test('should generate Ids for procedure as <package>.<service>.<procedure-name>', () => {
    const result = analyzer.readProto(pricesProto);
    expect(result[0].getId()).toBe("prices.streaming.Pricing.Subscribe");
  });

  test('should get service name  <package>.<service>', () => {
    const result = analyzer.readProto(pricesProto);
    expect(result[0].getService()).toBe("prices.streaming.Pricing");
  });

  test('should find service in a protofile', () => {
    const result = analyzer.readProto(greetProto);

    expect(result[0].getName()).toBe("SayHello");
  });

  test('should find service in a streaming protofile', () => {
    const result = analyzer.readProto(pricesProto);

    expect(result[0].getName()).toBe("Subscribe");
  });

  test('should get service name for endpoint', () => {
    const greeter = analyzer.readProto(greetProto).pop();
    const prices = analyzer.readProto(pricesProto).pop();

    expect(greeter.getServiceName()).toBe("Greeter");
    expect(prices.getServiceName()).toBe("Pricing");
  });

  test('should get package name for endpoint', () => {
    const greeter = analyzer.readProto(greetProto).pop();
    const prices = analyzer.readProto(pricesProto).pop();

    expect(greeter.getPackageName()).toBe("greet");
    expect(prices.getPackageName()).toBe("prices.streaming");
  });

  test('should encapsulate the endpoint protobuf', () => {
    const result = analyzer.readProto(pricesProto).pop();
    expect(result.getLoadedProto()).toBe(pricesProto);
  });

  test('should have streaming request or reponse', () => {
    const result = analyzer.readProto(pricesProto).pop();
    expect(result.isStreamingRequest()).toBe(false);
    expect(result.isStreamingResponse()).toBe(true);
  });
});
