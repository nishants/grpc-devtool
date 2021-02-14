const DEFAULT_STREAMING_DELAY = 1000;

const getRequest = (callContext) => {
  return new Promise((resolve, reject) => {
    const data = [];
    // TODO Currenlty resolves on  first data from client
    callContext.on('data', (response) => {
      data.push(response)
      resolve(response);
    });
    callContext.on('end', () => {
      if(data.length === 0){
        reject(`Empty message received from client at ${endpointId}`);
      }
      resolve(null);
    });
  });
};

module.exports = {
  create: async ({endpoint, mappingResolver, dataFiles}) => {
    return {
      endpointId: endpoint.getId(),
      canHandle: (endpointId) => {
        return endpoint.getId() === endpointId;
      },
      handle : async (callContext) => {
        const request = await getRequest(callContext);
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
  }
};
