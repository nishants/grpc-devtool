const {helloProto, pricesProto, createClient} = require('./test-helper');

const server = require('../src/server/endpoint-server');
const analyzer = require('../src/proto/proto-analyzer');

const host= "0.0.0.0";
const port= "50053";
const url = `${host}:${port}`;

describe('server.test.js', () => {
  let service ;
  const responses = {};
  const helloWorldEndpoint = analyzer.readProto(helloProto).pop();
  const pricesEndpoint = analyzer.readProto(pricesProto).pop();
  const client = createClient(url);

  beforeAll(() => {
    service = server.create({host, port});
    const handler = (context, send, endpoint) => {
      responses[endpoint.getId()](context, send)
    };

    service.add({
      protoFile: helloProto,
      endpoint: helloWorldEndpoint ,
      onRequest: handler});

    service.add({
      protoFile: pricesProto,
      endpoint: pricesEndpoint ,
      onRequest: handler});

    service.start();
  });

  afterAll(() => {
    service.stop();
  });

  test('should handle a unary endpoint', async () => {
    const expectedResponseMessage = 'hello world message';

    responses[helloWorldEndpoint.getId()] = (context, send)=> {
      expect(context.request.name).toBe("nishant");
      send(null, {message: expectedResponseMessage});
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

      context.write(responeOne);
      context.write(responseTwo);
      context.write(responseThree);

      context.end();
    };

    const actual = await client.readPricesStream({uic: 211, assetType: 'Stock'});
    expect(actual).toEqual(expected)
  });

});
