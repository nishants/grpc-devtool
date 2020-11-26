var protoLoader = require('@grpc/proto-loader');
const Endpoint = require('./Endpoint');

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

  let endpoints = Object.values(protofile).filter(isService).reduce((group, thiz) => {
    return [...group, ...Object.values(thiz)]
  }, []);
  return endpoints.map(e => Endpoint.create({
    name    : e.originalName,
    request : e.requestType,
    response: e.responseType,
  }));
}

readProto('./protos/greet.proto');

module.exports.readProto = readProto;