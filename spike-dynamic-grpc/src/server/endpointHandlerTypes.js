const DEFAULT_STREAMING_DELAY = 500;

const getHandlerFor = (endpoint) => {
  const type = endpoint.getResponse().isStream() ? "response-stream" : "unary";

  const handlerTypes = {
    "unary" : (response) => {
      return (call, send) => {
        send(null, response);
      };
    },
    "response-stream" : (response) => {
      return async (call) => {

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