const DEFAULT_STREAMING_DELAY = 500;

const {
  Unary,
  ServerStreaming,
  BothWayStreaming,
  getType
} = require('../proto/EndpointTypes');

const getHandlerFor = (endpoint) => {
  const type = getType(endpoint);

  let serverStreamHandler = (response) => {
    return async (call) => {
      if(!response){
        return call.end();
      }
      const responses = [...response.stream, {end: true}];
      const streamingDelay = response.streamInterval || DEFAULT_STREAMING_DELAY;

      for(let i =0; i < responses.length; i++){
        await new Promise((resolve => setTimeout(resolve, streamingDelay)));
        const response = responses[i];
        if(response.end) {
          call.end();
        }
        else {
          call.write(response);
        }
      }
    };
  };
  const handlerTypes = {

    [Unary] : (response) => {
      return (call, send) => {
        send(null, response);
      };
    },

    [ServerStreaming] : serverStreamHandler,
    [BothWayStreaming] : serverStreamHandler
  };

  return handlerTypes[type];
}


module.exports = {
  getHandlerFor
}