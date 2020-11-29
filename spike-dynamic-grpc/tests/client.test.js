const Client = require('../src/client');
const path = require('path');

const {helloProto, pricesProto} = require('./helpers');

const app = require('../src/app');
const analyzer = require('../src/proto/proto-analyzer');

const host= "0.0.0.0";
const port= "50053";

const parameters = {
  host,
  port,
  configPath : path.join(__dirname, './fixtures/config'),
  protosPath : path.join(__dirname, './fixtures/protos')
};

describe('app.js', () => {
  let closeApp;
  let client;
  const helloWorldEndpoint = analyzer.readProto(helloProto).pop();
  const pricesEndpoint = analyzer.readProto(pricesProto).pop();

  beforeAll(async () => {
    closeApp = await app.run(parameters);
    client   = await Client.create({host,port , endpoints: [helloWorldEndpoint]});
  });

  afterAll(async () => {
    await closeApp();
  });

  test('should create unary endpoint client', async () => {
    const reply = await client.execute({endpoint: helloWorldEndpoint, request: {name: "rohit"}});
    expect(reply).toEqual({message : "Hello Rohit"});
  });
});

