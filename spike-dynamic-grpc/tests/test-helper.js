const path = require('path');

const greetProtoFile = path.join(__dirname , '../protos/greet.proto');
const pricesProtoFile = path.join(__dirname , '../protos/prices.proto');

module.exports = {
  greetProtoFile: greetProtoFile,
  pricesProtoFile: pricesProtoFile
}