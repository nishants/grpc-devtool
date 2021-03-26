const {createClient} = require('./helpers');

const fixtures = require('./fixtures');
const app = require('../src/app');

const host= "0.0.0.0";
const port= "50053";

const appParameters = {
  host,
  port,
  configPath : fixtures.pricesProject.configPath,
  protosPath : fixtures.pricesProject.protosPath
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
    expect(responseThree).toEqual({message : "Glad to meet you nishant"});
  });

  test('should serve a streaming response', async () => {
    const responeOne    = {quote: "quote:one"};
    const responseTwo   = {quote: "quote:two"};
    const responseThree = {quote: "quote:three"};

    const expected = [responeOne, responseTwo, responseThree];

    const actual = await client.readPricesStream({uic: 211, assetType: 'Stock'});
    expect(actual).toEqual(expected);
  });

  test('should stream two way stream as server streaming endpoint', async () => {
    const responeOne    = {quote: "message:one"};
    const responseTwo   = {quote: "message:two"};
    const responseThree = {quote: "message:three"};

    const expected = [responeOne, responseTwo, responseThree];

    const actual = await client.readTwoWayStream({uic: 101, assetType: 'CfdOnStock'});
    expect(actual).toEqual(expected);
  });

  describe('Multiple templates for duplex stream', () => {

    test('should reply to single call', async () => {
      const expectedFxSpot = [
        {quote: "21:fxspot-one"},
        {quote: "21:fxspot-two"},
        {quote: "21:fxspot-three"}
      ];
      const actual = await client.readTwoWayStream({uic: 21, assetType: 'FxSpot'});
      expect(actual).toEqual(expectedFxSpot);
    });

    test('should support multiple templates for two way stream', async () => {
      const clientRequests = [
        {uic: 21, assetType: 'FxSpot'},
        {uic: 22, assetType: 'FxSpot'},
        {uic: 211, assetType: 'Stock'},
        {uic: 212, assetType: 'Stock'},
      ];

      const expectedQuotes =  [
        "21:fxspot-one",
        "21:fxspot-two",
        "21:fxspot-three",

        "22:fxspot-one",
        "22:fxspot-two",
        "22:fxspot-three",

        "211:stock-one",
        "211:stock-two",
        "211:stock-three",

        "212:stock-one",
        "212:stock-two",
        "212:stock-three"
      ].sort();

      const actual = await client.getClientStreamResponses(clientRequests, 1000);
      const actualQuotes = actual.map(m => m.quote).sort();

      expect(actualQuotes).toEqual(expectedQuotes);
    }, 2000);
  });

  describe('Should support expressions in template', () => {

    test('should support expressions in templates', async () => {
      const expectedFxSpot = [
        {quote: "299:stock-one"},
        {quote: "299:stock-two"},
        {quote: "299:stock-three"}
      ];
      const actual = await client.readTwoWayStream({uic: 299, assetType: 'Stock'});
      expect(actual).toEqual(expectedFxSpot);
    });
  });

});
