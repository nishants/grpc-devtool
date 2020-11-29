const Client = require('../src/client');
const path = require('path');

const {helloProto, pricesProto} = require('./helpers');

const app = require('../src/app');
const analyzer = require('../src/proto/proto-analyzer');

const host= "0.0.0.0";
const port= "50057";

const parameters = {
  host,
  port,
  configPath : path.join(__dirname, './fixtures/config'),
  protosPath : path.join(__dirname, './fixtures/protos')
};

describe('client.js', () => {
  let closeApp;
  let client;
  const helloWorldEndpoint = analyzer.readProto(helloProto).pop();
  const pricesEndpoint = analyzer.readProto(pricesProto).pop();

  beforeAll(async () => {
    closeApp = await app.run(parameters);
    client   = await Client.create({host,port , endpoints: [helloWorldEndpoint, pricesEndpoint]});
  });

  afterAll(async () => {
    await closeApp();
  });

  test('should create unary endpoint client', async () => {
    const reply = await client.execute({endpoint: helloWorldEndpoint, request: {name: "rohit"}});
    expect(reply).toEqual({message : "Hello Rohit"});
  });

  test('should create unary endpoint client', async () => {
    const expected = [{quote: "quote:one"}, {quote: "quote:two"}, {quote: "quote:three"}];

    const actual  = await client.execute({endpoint: pricesEndpoint, request: {uic: "211", assetType : "Stock"}});

    expect(actual).toEqual(expected);
  });
});

