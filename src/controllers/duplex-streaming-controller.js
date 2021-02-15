const DEFAULT_STREAMING_DELAY = 1000;

module.exports = {
  create: async ({endpoint, mappingResolver, dataFiles}) => {
    return {
      endpointId: endpoint.getId(),
      canHandle: (endpointId) => {
        return endpoint.getId() === endpointId;
      },
      handle : async (callContext) => {
        callContext.on('end', () => {
          callContext.end();
        });

        const respondToClientMessage = async (request) => {
          console.log(`Received request for ${endpoint.getId()} `, request);
          const responseFile = mappingResolver.getResponseFile(endpoint.getId(), request);
          const template = await dataFiles.get(responseFile);
          const response = template.getResponse().compile({request : {body: request}});

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
        };

        callContext.on('data', (response) => {
          respondToClientMessage(response);
        });
      }
    }
  }
};
