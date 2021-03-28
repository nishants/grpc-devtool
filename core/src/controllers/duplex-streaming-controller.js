const DEFAULT_STREAMING_DELAY = 1000;

module.exports = {
  create: async ({endpoint, mappingResolver, dataFiles, globalState, globalActions}) => {
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

          // ** Start of of streaming context handling ****************************************
          const stop = async () => {
            keepStreaming = false;
          };

          // Set streaming context
          if(response.hasOwnProperty("context")){
            globalState.streamingContexts[response.context] = {stop};
          }

          // Check for actions
          if(response.actions){
            for(const action in response.actions){
              const globalAction = globalActions[action];
              if(!globalAction){
                throw new Error(`Undefined actions : ${action}`)
              }
              await globalAction(response.actions[action]);
              console.log("Stopped streaming for messages")
            }
          }
          // ** End of streaming context handling ****************************************

          if(!response){
            return callContext.end();
          }

          const responses = [...response.stream];
          const streamingDelay = typeof response.streamInterval === 'undefined' ? DEFAULT_STREAMING_DELAY : response.streamInterval;
          let keepStreaming = !response.doNotRepeat ;

          for(let i =0; i < responses.length || keepStreaming; i++){
            const nextMessage = responses[i%responses.length];
            console.log(`Sending response for ${endpoint.getId()} from ${responseFile} `, nextMessage);
            callContext.write(nextMessage);
            await new Promise((resolve => setTimeout(resolve, streamingDelay)));
          }
          console.log("End of streaming for ", request)
        };

        callContext.on('data', (response) => {
          respondToClientMessage(response);
        });
      }
    }
  }
};
