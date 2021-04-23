const App = require('../app');
const Client = require('../client');

describe('app.js', () => {
  let app;
  beforeAll(async () => {
    app = await App.start();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should serve data', async () => {
    const responseOne = await Client.sayHello('nishant');
    expect(responseOne).toEqual('Hello nishant');
  });
});
