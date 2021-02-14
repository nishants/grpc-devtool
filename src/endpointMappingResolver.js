const matchers = require('./templateMatcher');

module.exports = {
  createResolvers : async ({endpoints, mappings, templates}) => {
    const endpointMatchers = {};

    for(const endpoint of endpoints){
      const endpointFileMatcher = [];
      const mappingFiles = mappings[endpoint.getId()] || [];

      for(const file of mappingFiles){
        if(Array.isArray(file)){
          // Ignore array of mappings
          continue;
        }
        const template = await templates.get(file)
        const matcher = matchers.create({definition: template.getRequest()});

        endpointFileMatcher.push({matcher, file});
      }

      endpointMatchers[endpoint.getId()] = endpointFileMatcher;
    }

    return {
      getResponseFile : (endpointId, request) => {
        const matcher = endpointMatchers[endpointId].find(m => m.matcher.matches(request));
        if(!matcher){
          console.error(`No response found for ${endpointId} when requested : `, request);
          return null;
        }
        return matcher.file;
      }
    };
  }
};
