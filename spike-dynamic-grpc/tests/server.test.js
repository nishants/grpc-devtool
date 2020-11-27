const {helloProto, clients} = require('./test-helper');

const server = require('../src/server/endpoint-server');
const analyzer = require('../src/proto/proto-analyzer');


const host= "0.0.0.0";
const port= "50053";
const url = `${host}:${port}`;

describe('server.test.js', () => {
  let service ;
  const responses = {};
  const  endpoint = analyzer.readProto(helloProto).pop();

  beforeEach(() => {
    service = server.create({host, port});
    const handler = (context, send, endpoint) => {
      send(null, responses[endpoint.getId()](context));
    };

    service.add({protoFile: helloProto, endpoint , onRequest: handler});
    service.start();
  });

  afterEach(() => {
    service.stop();
  });

  test('should handle a unary request', async () => {
    const expectedResponseMessage = 'hello world message';

    responses[endpoint.getId()] = (context)=> {
      expect(context.request.name).toBe("nishant")
      return {message: expectedResponseMessage}
    };

    const response = await clients.sayHelloWorld(url, {name: "nishant"});
    expect(response.message).toBe(expectedResponseMessage)
  });
});
