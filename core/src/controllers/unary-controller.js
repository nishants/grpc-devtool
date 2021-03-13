module.exports = {
  create: async ({endpoint, mappingResolver, dataFiles}) => {
    return {
      endpointId: endpoint.getId(),
      canHandle: (endpointId) => {
        return endpoint.getId() === endpointId;
      },
      handle : async (callContext, callback) => {
        const request = callContext.request;
        const responseFile = mappingResolver.getResponseFile(endpoint.getId(), request);
        const template = await dataFiles.get(responseFile);
        const response = template.getResponse().compile({request : {body: request}});
        callback(null, response);
      }
    }
  }
};
