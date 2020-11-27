const {helloProto, helloProtoFilePath} = require('./test-helper');

const server = require('../src/server/endpoint-server');
const analyzer = require('../src/proto/proto-analyzer');

var grpc = require('grpc');

const host= "0.0.0.0";
const port= "50053";
const url = `${host}:${port}`;

describe('server.test.js', () => {
  let service ;

  beforeEach(() => {
    service = server.create({host, port});
  });

  afterEach(() => {
    service.stop();
  });

  test('should handle a unary request', async () => {

    const handler = (call, send, endpoint) => {
      const message = `${endpoint.getId()} : hello ${call.request.name}`;
      send(null, {message});
    };

    const  endpoint = analyzer.readProto(helloProto).pop();

    service.add({protoPath: helloProtoFilePath, endpoint , onRequest: handler});
    service.start();

    const hello_proto = grpc.loadPackageDefinition(helloProto).helloworld.greet;
    const client = new hello_proto.Greeter(url, grpc.credentials.createInsecure());

    const expectedResponseMessage = 'helloworld.greet.Greeter/SayHello : hello nishant';

    await new Promise((resolve) => {
      client.sayHello({name: "nishant"}, function(err, response) {
        expect(response.message).toBe(expectedResponseMessage)
        resolve();
      });
    });
  });
});
