const path = require('path');
const protoLoader = require('@grpc/proto-loader');

const server = require('./src/server/endpoint-server');
const analyzer = require('./src/proto/proto-analyzer');

const greet = path.join(__dirname , './protos/helloworld.proto');

const protoFiles = [greet];

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

const createEnpointHandler = (endpoint) => {
  const handler = (call, send, endpoint) => {
    const compiledMessage = {message: 'path: '+ endpoint.getId()+ ', request : ' +  call.request.name};
    send(null, compiledMessage);
  };
  service.add({protoPath: greet, endpoint, onRequest: handler});
};

var service = server.create({host: "0.0.0.0", port: "50053"});


// Add handler for each endpoint in each proto file,
protoFiles
  .map(file => analyzer.readProto(loadFile(file)))
  .reduce((arr, files) => [...arr, ...files], [])
  .forEach(createEnpointHandler);

service.start();