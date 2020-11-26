const path = require('path');
const analyzer = require('../src/proto-analyzer');
const simpleProtoFile = path.join(__dirname , '../protos/greet.proto');

test('should find service in a protofile', () => {
  const result = analyzer.readProto(simpleProtoFile);
  expect(result[0].originalName).toBe("sayHello");
});