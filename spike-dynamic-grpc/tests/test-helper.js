const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const greetProtoFile = path.join(__dirname , '../protos/greet.proto');
const pricesProtoFile = path.join(__dirname , '../protos/prices.proto');

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


module.exports = {
  greetProto: loadFile(greetProtoFile),
  pricesProto: loadFile(pricesProtoFile)
}