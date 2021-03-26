const appTestHelper = require('./appTestHelper');
const fixtures = require('../fixtures');

describe('app.js', () => {
  let app;

  beforeAll(async () => {
    app = await appTestHelper.launchApp({
      port: 50055,
      protosPath: fixtures.pricesProject.protosPath,
      configPath: fixtures.pricesProject.configPath,
    });
  });

  afterAll(async () => {
    await app.closeApp();
  });

  describe('Should support expressions in template', () => {

    test('should support expressions in templates', async () => {
      const expectedFxSpot = [
        {quote: "299:stock-one"},
        {quote: "299:stock-two"},
        {quote: "299:stock-three"}
      ];
      const actual = await app.client.readTwoWayStream({uic: 299, assetType: 'Stock'});
      expect(actual).toEqual(expectedFxSpot);
    });
  });

});
