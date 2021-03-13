const protoLoader = require('@grpc/proto-loader');
const analyzer = require('./proto/proto-analyzer');

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
  loadFiles : async (files)=> {
    return files.map(file => {
        const loadedProtofile = loadFile(file);
        return analyzer.readProto(loadedProtofile);
      })
      .reduce((arr, files) => [...arr, ...files], []);
  }
};