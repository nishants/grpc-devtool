const {unaryRequestResponseProtoFile, streamResponseProtoFile} = require('../test-helper');

const analyzer = require('../../src/proto/proto-analyzer');

describe('endpoint.test.js', () => {
  test('should find service in a protofile', () => {
    const result = analyzer.readProto(unaryRequestResponseProtoFile);

    expect(result[0].getName()).toBe("SayHello");
  });

  test('should find service in a streaming protofile', () => {
    const result = analyzer.readProto(streamResponseProtoFile);

    expect(result[0].getName()).toBe("Subscribe");
  });

  test('should get service name for endpoint', () => {
    const greeter = analyzer.readProto(unaryRequestResponseProtoFile).pop();
    const prices = analyzer.readProto(streamResponseProtoFile).pop();

    expect(greeter.getServiceName()).toBe("Greeter");
    expect(prices.getServiceName()).toBe("Pricing");
  });

  test('should get package name for endpoint', () => {
    const greeter = analyzer.readProto(unaryRequestResponseProtoFile).pop();
    const prices = analyzer.readProto(streamResponseProtoFile).pop();

    expect(greeter.getPackageName()).toBe("greet");
    expect(prices.getPackageName()).toBe("prices.streaming");
  });
});
