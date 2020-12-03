const DEFAULT_STREAMING_DELAY = 500;
const MAX_STREAMING_DURATION = 120000;

const {
  Unary,
  ServerStreaming,
  BothWayStreaming,
  getType
} = require('../proto/EndpointTypes');

const getHandlerFor = (endpoint) => {
  const type = getType(endpoint);

  const serverStreamHandler = (response) => {
    return async (call) => {
      if(!response){
        return call.end();
      }
      const responses = [...response.stream];
      const streamingDelay = response.streamDelay || DEFAULT_STREAMING_DELAY;
      let keepStreaming = !response.doNotRepeat ;

      if(keepStreaming){
        setTimeout(() => {
          keepStreaming = false;
          console.log(`Closing streaming for ${endpoint.getId()}`)
        }, MAX_STREAMING_DURATION);
      }

      for(let i =0; i < responses.length || keepStreaming; i++){
        await new Promise((resolve => setTimeout(resolve, streamingDelay)));
          call.write(responses[i%responses.length]);
      }
      call.end();
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