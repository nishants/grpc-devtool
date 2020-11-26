const {unaryRequestResponseProtoFile, streamResponseProtoFile} = require('./test-helper');

const analyzer = require('../src/proto-analyzer');

describe('endpoint.test.js', () => {
  test('should find service in a protofile', () => {
    const result = analyzer.readProto(unaryRequestResponseProtoFile);

    expect(result[0].getName()).toBe("SayHello");
  });

  test('should find service in a streaming protofile', () => {
    const result = analyzer.readProto(streamResponseProtoFile);

    expect(result[0].getName()).toBe("Subscribe");
  });
});
