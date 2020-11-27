const {helloProto, pricesProto, createClient} = require('./test-helper');
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

  test('should serve a mapping', async () => {
    const response = await client.sayHelloWorld({name: "rohit"});
    expect(response).toEqual({message : "hello rohit"});
  });
});
