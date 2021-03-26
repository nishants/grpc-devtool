const appTestHelper = require('./appTestHelper');
const fixtures = require('../fixtures');

describe('app.js', () => {
  let app;

  beforeAll(async () => {
    app = await appTestHelper.launchApp({
      port: 50054,
      protosPath: fixtures.pricesProject.protosPath,
      configPath: fixtures.pricesProject.configPath,
    });
  });

  describe('Multiple templates for duplex stream', () => {
    test('should reply to single call', async () => {
      const expectedFxSpot = [
        {quote: "21:fxspot-one"},
        {quote: "21:fxspot-two"},
        {quote: "21:fxspot-three"}
      ];
      const actual = await app.client.readTwoWayStream({uic: 21, assetType: 'FxSpot'});
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

      const actual = await app.client.getClientStreamResponses(clientRequests, 1000);
      const actualQuotes = actual.map(m => m.quote).sort();

      expect(actualQuotes).toEqual(expectedQuotes);
    }, 2000);
  });
});
