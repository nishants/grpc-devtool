const {helloProto} = require('./test-helper');

const server = require('../src/server/endpoint-server');
const analyzer = require('../src/proto/proto-analyzer');

var grpc = require('grpc');

const host= "0.0.0.0";
const port= "50053";
const url = `${host}:${port}`;

describe('server.test.js', () => {
  let service ;
  const responses = {};
  const  endpoint = analyzer.readProto(helloProto).pop();

  beforeEach(() => {
    service = server.create({host, port});
    const handler = (call, send, endpoint) => {
      send(null, responses[endpoint.getId()]);
    };

    service.add({protoFile: helloProto, endpoint , onRequest: handler});
    service.start();
  });

  afterEach(() => {
    service.stop();
  });

  test('should handle a unary request', async () => {
    const expectedResponseMessage = 'hello world message';

    // Setup response
    responses[endpoint.getId()] = {message: expectedResponseMessage};

    const hello_proto = grpc.loadPackageDefinition(helloProto).helloworld.greet;
    const client = new hello_proto.Greeter(url, grpc.credentials.createInsecure());
    await new Promise((resolve) => {
      client.sayHello({name: "nishant"}, function(err, response) {
        expect(response.message).toBe(expectedResponseMessage)
        resolve();
      });
    });
  });
});
