var protoLoader = require('@grpc/proto-loader');

var readProto = (protoFilePath) => {
  const protofile = protoLoader.loadSync(
    protoFilePath,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });

  var isService = member => ! member.format;

  return Object.values(protofile).filter(isService).reduce((group, thiz) => {
    return [...group, ...Object.values(thiz)]
  }, []);
}

readProto('./protos/greet.proto');

module.exports.readProto = readProto;