const {
  Unary,
  ServerStreaming,
  BothWayStreaming,
  getType
} = require('../proto/EndpointTypes');

const DEFAULT_STREAMING_DELAY = 1000;

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

const serverStreamController = (endpoint, mappingResolver, dataFiles) => {
  return {
    canHandle: async (endpointId) => {
      return endpoint.getId() === endpointId;
    },
    handle : async (callContext) => {
      const request = callContext.request;
      const responseFile = mappingResolver.getResponseFile(endpoint.getId(), request);
      const template = await dataFiles.get(responseFile);
      const response = template.getResponse().compile();

      if(!response){
        return callContext.end();
      }

      const responses = [...response.stream];
      const streamingDelay = typeof response.streamInterval === 'undefined' ? DEFAULT_STREAMING_DELAY : response.streamInterval;
      let keepStreaming = !response.doNotRepeat ;

      for(let i =0; i < responses.length || keepStreaming; i++){
        await new Promise((resolve => setTimeout(resolve, streamingDelay)));
        callContext.write(responses[i%responses.length]);
      }

      callContext.end();
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
      return serverStreamController(endpoint, mappingResolver, dataFiles);
    }

    if(isClientStream){
      return clientStreamController(endpoint, mappingResolver);
    }

    return duplexStreamController(endpoint, mappingResolver);
  }
}
