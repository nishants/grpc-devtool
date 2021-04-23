const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'protos/helloworld.proto');

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const packages = grpc.loadPackageDefinition(packageDefinition);

// Get the proto by package name declared in proto file
// package helloworld;
const helloWorldPackage = packages.helloworld;

const sayHelloHandler = (call, callback) => {
  callback(null, {message: 'Hello ' + call.request.name});
}

const server = new grpc.Server();

module.exports = {
  start: () => {
    server.addService(helloWorldPackage.Greeter.service, {sayHello: sayHelloHandler});
    server.bindAsync('0.0.0.0:3009', grpc.ServerCredentials.createInsecure(), (error) => {
      if(error){
        return console.error(error);
      }
      server.start();
    });
  }
}
