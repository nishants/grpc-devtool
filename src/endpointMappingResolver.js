const matchers = require('./templateMatcher');

module.exports = {
  createResolvers : async ({endpoints, mappings, templates}) => {
    const endpointMatchers = {};

    for(const endpoint of endpoints){
      const endpointFileMatcher = [];
      const mappingFiles = mappings[endpoint.getId()] || [];

      for(const file of mappingFiles){
        if(Array.isArray(file)){
          const templateList =  await Promise.all(file.map(templates.get));
          const matcherList  =  await Promise.all(templateList.map((template) => {
            return matchers.create({definition: template.getRequest()})
          }));
          const fileMatchers = matcherList.map((matcher, index) => {
            return {
              matcher,
              file: file[index]
            };
          });

          endpointFileMatcher.push({matcher: matchers.anyOf(matcherList), fileMatchers});
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
        if(matcher.hasOwnProperty("file")){
          return matcher.file;
        }

        const fileMatcher = matcher.fileMatchers.find(fm => fm.matcher.matches(request));
        return fileMatcher.file;
      }
    };
  }
};
