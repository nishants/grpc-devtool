const protoLoader = require('@grpc/proto-loader');
var grpc = require('@grpc/grpc-js');

const fixtures = require('../fixtures');

const greetProtoFile  = fixtures.pricesProject.protos.greet;
const pricesProtoFile = fixtures.pricesProject.protos.prices;
const helloProtoFilePath  = fixtures.pricesProject.protos.helloworld;

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

      readTwoWayStream : (request, timeout = 1000) => new Promise(async (resolve, reject) => {
        const protoDefinition = grpc.loadPackageDefinition(pricesProto).prices.streaming;
        const client = new protoDefinition.Pricing(url, grpc.credentials.createInsecure());

        const data = [];
        const call = client.TwoWaySubscribe();

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
        setTimeout(() => call.end(), timeout);
      }),

      openPriceStream : (timeout = 1000) => new Promise(async (resolve, reject) => {
        const protoDefinition = grpc.loadPackageDefinition(pricesProto).prices.streaming;
        const client = new protoDefinition.Pricing(url, grpc.credentials.createInsecure());

        const data = [];
        const call = client.TwoWaySubscribe();


        call.on('data', function(response) {
          data.push(response);
        });

        call.on('end', function() {
          resolve(data);
        });

        call.on('error', function(error) {
          reject({data, error});
        });
        // setTimeout(() => call.end(), timeout);
        resolve({
            stop: async () => {
              await call.end();
            },
            sendMessage : (request) => {
              call.write(request);
            },
            getNext : () => {
              return new Promise(resolve => {
                // return updates received so far and clear saved data
                const messages = data.splice(0);
                resolve(messages);
              })
            }
          }
        )
      }),

      getClientStreamResponses : (requests, timeout = 1000) => new Promise(async (resolve, reject) => {
        const protoDefinition = grpc.loadPackageDefinition(pricesProto).prices.streaming;
        const client = new protoDefinition.Pricing(url, grpc.credentials.createInsecure());

        const data = [];
        const call = client.TwoWaySubscribe();

        requests.forEach((request) => {
          call.write(request);
        })

        call.on('data', function(response) {
          data.push(response);
        });

        call.on('end', function() {
          resolve(data);
        });

        call.on('error', function(error) {
          reject({data, error});
        });

        setTimeout(() => call.end(), timeout);
      })

    };
  }
}
