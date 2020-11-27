const path = require('path');
const protoLoader = require('@grpc/proto-loader');

const server = require('./src/server/endpoint-server');
const analyzer = require('./src/proto/proto-analyzer');

const pricesProtoFile = path.join(__dirname , './tests/fixtures/protos/prices.proto');
const helloWorldProtoFile = path.join(__dirname , './tests/fixtures/protos/helloworld.proto');

const protoFiles = [pricesProtoFile, helloWorldProtoFile];

const loadFile = (protoFilePath) => {
  return protoLoader.loadSync(
    protoFilePath,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
};

const handlers = {
  'helloworld.greet.Greeter.SayHello' : (call, send) => {
    send(null, {message : `hello ${call.request.name}`});
  },
  'prices.streaming.Pricing.Subscribe' : (call) => {
    let i = 0;
    setInterval(() => call.write({quote : `quote${i++}`}), 1000);
  }
};

const createEnpointHandler = ({endpoint, loadedProtofile}) => {
  const handler = (call, send, endpoint) => {
    let id = endpoint.getId();
    const handler = handlers[id];
    handler(call, send);
  };
  service.add({protoFile: loadedProtofile, endpoint, onRequest: handler});
};

var service = server.create({host: "0.0.0.0", port: "50053"});


// Add handler for each endpoint in each proto file,
protoFiles
  .map(file => {
    const loadedProtofile = loadFile(file);
    return analyzer.readProto(loadedProtofile).map(endpoint => ({
      endpoint,
      loadedProtofile
    }));
  })
  .reduce((arr, files) => [...arr, ...files], [])
  .forEach(createEnpointHandler);

service.start();