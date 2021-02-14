const {
  Unary,
  ServerStreaming,
  BothWayStreaming,
  getType
} = require('../proto/EndpointTypes');

const compileResponseFile = async (file, dataFiles)=> {
  const template = await dataFiles.get(file);
  const response = template.getResponse();
  return response.compile();
};

const unaryController = (endpoint, mappingResolver, dataFiles) => {
  return {
    endpointId: endpoint.getId(),
    canHandle: (endpointId) => {
      return endpoint.getId() === endpointId;
    },
    handle : async (callContext, callback) => {
      const request = callContext.request;
      const responseFile = mappingResolver.getResponseFile(endpoint.getId(), request);
      const template = await dataFiles.get(responseFile);
      const response = template.getResponse().compile();
      callback(null, response);
    }
  }
};

const serverStreamController = (endpoint) => {

  return {
    canHandle: async (endpointId) => {

    },
    handle : async (endpointId, callContext) => {

    }
  }
};

const clientStreamController = (endpoint) => {
  return {
    canHandle: async (endpointId) => {

    },
    handle : async (endpointId, callContext) => {

    }
  }
};

const duplexStreamController = (endpoint) => {
  return {
    canHandle: async (endpointId) => {

    },
    handle : async (endpointId, callContext) => {

    }
  }
};

module.exports = {
  create: (endpoint, mappingResolver, dataFiles) => {
    const type = getType(endpoint);

    const clientStream = endpoint.isStreamingRequest();
    const serverStream = endpoint.isStreamingResponse();

    const isUnary = clientStream === false && serverStream === false;
    const isServerStream = clientStream === false && serverStream === true;
    const isClientStream = clientStream === true && serverStream === false;

    if(isUnary){
      return unaryController(endpoint, mappingResolver, dataFiles);
    }

    if(isServerStream){
      return serverStreamController(endpoint, mappingResolver);
    }

    if(isClientStream){
      return clientStreamController(endpoint, mappingResolver);
    }

    return duplexStreamController(endpoint, mappingResolver);
  }
}
