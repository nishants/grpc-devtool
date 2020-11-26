const path = require('path');
const analyzer = require('../src/proto-analyzer');

const unaryRequestResponseProtoFile = path.join(__dirname , '../protos/greet.proto');
const streamResponseProtoFile = path.join(__dirname , '../protos/prices.proto');

test('should find service in a protofile', () => {
  const result = analyzer.readProto(unaryRequestResponseProtoFile);

  expect(result[0].getName()).toBe("sayHello");
});

test('should read request type from protofile endpoint', () => {
  const result  = analyzer.readProto(unaryRequestResponseProtoFile);
  const request = result[0].getRequest();

  expect(request.getName()).toBe("HelloRequest");
});

test('should read request fields from protofile endpoint', () => {
  const result  = analyzer.readProto(unaryRequestResponseProtoFile);
  const request = result[0].getRequest();
  const nameField = request.getFields()[0];

  expect(nameField.getName()).toBe("name");
  expect(nameField.getType()).toBe("string");
});

test('should read response type from protofile endpoint', () => {
  const result  = analyzer.readProto(unaryRequestResponseProtoFile);
  const response = result[0].getResponse();

  expect(response.getName()).toBe("HelloReply");
});

test('should read response fields from protofile endpoint', () => {
  const result  = analyzer.readProto(unaryRequestResponseProtoFile);
  const response = result[0].getResponse();
  const nameField = response.getFields()[0];

  expect(nameField.getName()).toBe("message");
  expect(nameField.getType()).toBe("string");
});


describe('message.isStreaming', () => {
  test('for non streaming', () => {
    const result  = analyzer.readProto(unaryRequestResponseProtoFile);

    const request = result[0].getRequest();
    const response = result[0].getResponse();

    expect(response.isStream()).toBe(false);
    expect(request.isStream()).toBe(false);
  });

  test('should find when request  or response is streaming', () => {
    const result  = analyzer.readProto(streamResponseProtoFile);

    const request = result[0].getRequest();
    const response = result[0].getResponse();

    expect(response.isStream()).toBe(true);
    expect(request.isStream()).toBe(false);
  });
});
