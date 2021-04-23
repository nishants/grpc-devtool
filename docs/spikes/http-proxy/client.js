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

const target = 'localhost:3009';
const client = new helloWorldPackage.Greeter(
  target,grpc.credentials.createInsecure()
);

client.sayHello({name: "foo-bar"}, function(error, response) {
  if(error){
    return console.error(error);
  }
  console.log('Greeting:', response.message);
});
