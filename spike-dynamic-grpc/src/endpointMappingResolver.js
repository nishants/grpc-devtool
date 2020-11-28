const matchers = require('./mapping/matchers');

module.exports = {
  createResolvers : async ({endpoints, mappings, templates}) => {
    const endpointMatchers = {};

    for(const endpoint of endpoints){
      const endpointFileMatcher = [];
      const mappingFiles = mappings[endpoint.getId()] || [];

      for(const file of mappingFiles){
        const template = await templates.get(file)
        const matcher = matchers.create({definition: template.getRequest()});

        endpointFileMatcher.push({matcher, file});
      }

      endpointMatchers[endpoint.getId()] = endpointFileMatcher;
    }

    return {
      getResponseFile : (endpointId, request) => {
        const matcher = endpointMatchers[endpointId].find(m => m.matcher.matches(request));
        return matcher.file;
      }
    };
  }
};