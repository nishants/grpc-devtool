const protoLoader = require('@grpc/proto-loader');
const analyzer = require('./proto-analyzer');

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

module.exports = async (file)=> {
  const endpoints =  analyzer.readProto(loadFile(file));
  return !!endpoints.length;
};