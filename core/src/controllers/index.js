const UnaryController = require('./unary-controller');
const ServerStreamController = require('./server-streaming-controller');
const ClientStreamController = require('./duplex-streaming-controller');
const DuplexStreamController = require('./duplex-streaming-controller');

module.exports = {
  create: (endpoint, mappingResolver, dataFiles, globalState, globalActions) => {
    const clientStream = endpoint.isStreamingRequest();
    const serverStream = endpoint.isStreamingResponse();

    const isUnary = clientStream === false && serverStream === false;
    const isServerStream = clientStream === false && serverStream === true;
    const isClientStream = clientStream === true && serverStream === false;

    if(isUnary){
      return UnaryController.create({endpoint, mappingResolver, dataFiles});
    }

    if(isServerStream){
      return ServerStreamController.create({endpoint, mappingResolver, dataFiles, globalState, globalActions});
    }

    if(isClientStream){
      return ClientStreamController.create({endpoint, mappingResolver, dataFiles, globalState, globalActions});
    }

    return DuplexStreamController.create({endpoint, mappingResolver, dataFiles, globalState, globalActions});
  }
}
