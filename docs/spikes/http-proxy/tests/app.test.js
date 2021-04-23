const App = require('../app');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const PROTO_PATH = path.join(__dirname, '../protos/helloworld.proto');

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const packages = grpc.loadPackageDefinition(packageDefinition);
const helloPackage = packages.helloworld;

describe('app.js', () => {
  let app;
  beforeAll(async () => {
    app = await App.start();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should serve data', async () => {
    const responseOne = await packages.sayHelloWorld({name: "rohit"});
    expect(responseOne).toEqual({message : "Hello Rohit"});
  });
});
