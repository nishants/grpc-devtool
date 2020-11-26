const {greetProtoFile, pricesProtoFile} = require('../test-helper');

const analyzer = require('../../src/proto/proto-analyzer');

describe('endpoint.test.js', () => {
  test('should generate Ids for procedure as <package>.<service>.<procedure-name>', () => {
    const result = analyzer.readProto(pricesProtoFile);
    expect(result[0].getId()).toBe("prices.streaming.Pricing/Subscribe");
  });

  test('should find service in a protofile', () => {
    const result = analyzer.readProto(greetProtoFile);

    expect(result[0].getName()).toBe("SayHello");
  });

  test('should find service in a streaming protofile', () => {
    const result = analyzer.readProto(pricesProtoFile);

    expect(result[0].getName()).toBe("Subscribe");
  });

  test('should get service name for endpoint', () => {
    const greeter = analyzer.readProto(greetProtoFile).pop();
    const prices = analyzer.readProto(pricesProtoFile).pop();

    expect(greeter.getServiceName()).toBe("Greeter");
    expect(prices.getServiceName()).toBe("Pricing");
  });

  test('should get package name for endpoint', () => {
    const greeter = analyzer.readProto(greetProtoFile).pop();
    const prices = analyzer.readProto(pricesProtoFile).pop();

    expect(greeter.getPackageName()).toBe("greet");
    expect(prices.getPackageName()).toBe("prices.streaming");
  });
});
