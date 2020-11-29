const DEFAULT_STREAMING_DELAY = 500;

const {
  Unary,
  ServerStreaming,
  getType
} = require('../proto/EndpointTypes');

const getHandlerFor = (endpoint) => {
  const type = getType(endpoint);

  const handlerTypes = {

    [Unary] : (response) => {
      return (call, send) => {
        send(null, response);
      };
    },

    [ServerStreaming] : (response) => {
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
    }
  };

  return handlerTypes[type];
}


module.exports = {
  getHandlerFor
}