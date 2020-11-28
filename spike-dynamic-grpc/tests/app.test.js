const {createClient} = require('./test-helper');
const path = require('path');

const app = require('../src/app');

const host= "0.0.0.0";
const port= "50053";

const appParameters = {
  host,
  port,
  configPath : path.join(__dirname, './fixtures/config'),
  protosPath : path.join(__dirname, './fixtures/protos')
};

describe('app.js', () => {
  let closeApp;
  let client;

  beforeAll(async () => {
    closeApp = await app.run(appParameters);
    client = createClient(`${host}:${port}`);
  });

  afterAll(async () => {
    await closeApp();
  });

  test('should serve a unary response', async () => {
    const responseOne = await client.sayHelloWorld({name: "rohit"});
    expect(responseOne).toEqual({message : "Hello Rohit"});

    const responseTwo = await client.sayHelloWorld({name: "virat"});
    expect(responseTwo).toEqual({message : "Hello virat"});

    const responseThree = await client.sayHelloWorld({name: "nishant"});
    expect(responseThree).toEqual({message : "Glad to meet you {{request.body.name}}"});
  });

  test('should serve a streaming response', async () => {
    const responeOne    = {quote: "quote:one"};
    const responseTwo   = {quote: "quote:two"};
    const responseThree = {quote: "quote:three"};

    const expected = [responeOne, responseTwo, responseThree];

    const actual = await client.readPricesStream({uic: 211, assetType: 'Stock'});
    expect(actual).toEqual(expected)  });
});
