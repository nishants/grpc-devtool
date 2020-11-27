const protoLoader = require('@grpc/proto-loader');
const path = require('path');
var grpc = require('grpc');

const greetProtoFile  = path.join(__dirname, '../protos/greet.proto');
const pricesProtoFile = path.join(__dirname, '../protos/prices.proto');
const helloProtoFilePath  = path.join(__dirname, '../protos/helloworld.proto');

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


const helloProto = loadFile(helloProtoFilePath);

module.exports = {
  greetProto: loadFile(greetProtoFile),
  pricesProto: loadFile(pricesProtoFile),
  helloProto,

  createClient: (url) => {
    return {
      sayHelloWorld : (request) => new Promise(async (resolve, reject) => {
        const protoDefinition = grpc.loadPackageDefinition(helloProto).helloworld.greet;
        const client = new protoDefinition.Greeter(url, grpc.credentials.createInsecure());

        client.sayHello(request, function(err, response) {
          if(err) {
            return reject(err);
          }
          resolve(response);
        });
      })
    };
  }
}