const {readYamlFileInDir} = require('./utils/files');
const matchers = require('./mapping/matchers');

module.exports = {
  createResolvers : async ({endpoints, mappings, configPath}) => {
    const endpointMatchers = {};

    for(const endpoint of endpoints){
      const endpointFileMatcher = [];
      const mappingFiles = mappings[endpoint.getId()] || [];

      for(const file of mappingFiles){
        const template = await readYamlFileInDir(configPath, file);
        const matcher = matchers.create({definition: template['request@']});

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