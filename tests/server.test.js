const {helloProto, pricesProto, createClient} = require('./helpers');

const server = require('../src/server/endpoint-server');
const analyzer = require('../src/proto/proto-analyzer');

const host= "0.0.0.0";
const port= "50055";
const url = `${host}:${port}`;

describe('server.test.js', () => {
  let service ;
  const responses = {};
  const helloWorldEndpoint = analyzer.readProto(helloProto).pop();
  const pricesEndpoint = analyzer.readProto(pricesProto).pop();

  const endpointResponder = {
    getResponse: async (endpointId, callContext) => {
      return responses[endpointId](callContext)
    }
  };

  const client = createClient(url);

  beforeAll(() => {
    service = server.create({host, port, endpointResponder});
    const handler = (context, send, endpoint) => {
      responses[endpoint.getId()](context, send)
    };

    service.add(helloWorldEndpoint);
    service.add(pricesEndpoint);

    service.start();
  });

  afterAll(() => {
    service.stop();
  });

  test('should handle a unary endpoint', async () => {
    const expectedResponseMessage = 'hello world message';

    responses[helloWorldEndpoint.getId()] = (context)=> {
      expect(context.request.name).toBe("nishant");
      return {message: expectedResponseMessage};
    };

    const response = await client.sayHelloWorld({name: "nishant"});
    expect(response.message).toBe(expectedResponseMessage)
  });

  test('should handle a streaming response', async () => {
    const responeOne    = {quote: "quote:one"};
    const responseTwo   = {quote: "quote:two"};
    const responseThree = {quote: "quote:three"};

    const expected = [responeOne, responseTwo, responseThree];

    responses[pricesEndpoint.getId()] = (context)=> {
      expect(context.request.uic).toBe('211');
      expect(context.request.assetType).toBe('Stock');

      return {stream : [responeOne, responseTwo, responseThree]};
    };

    const actual = await client.readPricesStream({uic: 211, assetType: 'Stock'});
    expect(actual).toEqual(expected)
  });

});
