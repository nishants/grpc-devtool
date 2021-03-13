const Endpoint = require('./endpoint');

var readProto = (protofile) => {
  var isService = member => ! member.format;

  let endpoints = Object.values(protofile).filter(isService).reduce((group, thiz) => {
    return [...group, ...Object.values(thiz)]
  }, []);
  return endpoints.map(e => Endpoint.create(e, protofile));
}

module.exports.readProto = readProto;