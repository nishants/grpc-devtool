const Client = require('../src/client');

const {helloProto, pricesProto} = require('./helpers');

const app = require('../src/app');
const fixtures = require('./fixtures');
const analyzer = require('../src/proto/proto-analyzer');

const host= "0.0.0.0";
const port= "50057";

const parameters = {
  host,
  port,
  configPath : fixtures.pricesProject.configPath,
  protosPath : fixtures.pricesProject.protosPath
};

describe('client.js', () => {
  let closeApp;
  let client;
  const helloWorldEndpoint = analyzer.readProto(helloProto).find(e => e.getName() === "SayHello");
  const serverStreamingEndpoint = analyzer.readProto(pricesProto).find(e => e.getName() === "Subscribe");
  const twoWayStreamingEndpoint = analyzer.readProto(pricesProto).find(e => e.getName() === "TwoWaySubscribe");

  beforeAll(async () => {
    closeApp = await app.run(parameters);
    client   = await Client.create({host,port , endpoints: [helloWorldEndpoint, serverStreamingEndpoint, twoWayStreamingEndpoint]});
  });

  afterAll(async () => {
    await closeApp();
  });

  test('should create unary endpoint client', async () => {
    const reply = await client.execute({endpoint: helloWorldEndpoint, request: {name: "rohit"}});
    expect(reply).toEqual({message : "Hello Rohit"});
  });

  test('should create streaming endpoint client', async () => {
    const expected = [{quote: "quote:one"}, {quote: "quote:two"}, {quote: "quote:three"}];

    const actual  = await client.execute({endpoint: serverStreamingEndpoint, request: {uic: "211", assetType : "Stock"}});

    expect(actual.stream).toEqual(expected);
  });

  test('should create both way streaming client', async () => {
    const expected = [{quote: "message:one"}, {quote: "message:two"}, {quote: "message:three"}];

    const actual  = await client.execute({
      endpoint: twoWayStreamingEndpoint,
      request: {uic: "213", assetType : "Stock"},
      trimmedStreamSize: 3
    });

    expect(actual.stream).toEqual(expected);
  }, 1500);

});
