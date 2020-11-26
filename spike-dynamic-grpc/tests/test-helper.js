const path = require('path');

const unaryRequestResponseProtoFile = path.join(__dirname , '../protos/greet.proto');
const streamResponseProtoFile = path.join(__dirname , '../protos/prices.proto');

module.exports = {
  unaryRequestResponseProtoFile,
  streamResponseProtoFile
}