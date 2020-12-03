const protoLoader = require('@grpc/proto-loader');
const path = require('path');
var grpc = require('grpc');

const greetProtoFile  = path.join(__dirname, '../fixtures/protos/greet.proto');
const pricesProtoFile = path.join(__dirname, '../fixtures/protos/prices.proto');
const helloProtoFilePath  = path.join(__dirname, '../fixtures/protos/helloworld.proto');

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
const pricesProto = loadFile(pricesProtoFile);

module.exports = {
  greetProto: loadFile(greetProtoFile),
  pricesProto,
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
      }),
      readPricesStream : (request) => new Promise(async (resolve, reject) => {
        const protoDefinition = grpc.loadPackageDefinition(pricesProto).prices.streaming;
        const client = new protoDefinition.Pricing(url, grpc.credentials.createInsecure());

        const data = [];
        const call = client.Subscribe(request);

        call.on('data', function(response) {
          data.push(response);
        });

        call.on('end', function() {
          resolve(data);
        });

        call.on('error', function(error) {
          reject({data, error});
        });
      }),

      readTwoWayStream : (request) => new Promise(async (resolve, reject) => {
        const protoDefinition = grpc.loadPackageDefinition(pricesProto).prices.streaming;
        const client = new protoDefinition.Pricing(url, grpc.credentials.createInsecure());

        const data = [];
        const call = client.TwoWaySubscribe(request);

        call.write(request);

        call.on('data', function(response) {
          data.push(response);
        });

        call.on('end', function() {
          resolve(data);
        });

        call.on('error', function(error) {
          reject({data, error});
        });

      })


    };
  }
}