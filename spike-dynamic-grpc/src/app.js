const mappingsReader = require('./mappingsReader');
const protosReader = require('./protosReader');
const endpointsLoader = require('./endpointsLoader');
const endpointMappingResolver = require('./endpointMappingResolver');

module.exports = {
  run : async ({host, port, configPath, protosPath, extensionsPath}) => {
   console.log('Starting with configuration : ');
   console.log({host, port, configPath, protosPath, extensionsPath});

   const mappings   = await mappingsReader.readFrom(configPath);
   const protoFiles = await protosReader.readFrom(protosPath);
   const endpoints  = await endpointsLoader.loadFiles(protoFiles);
   const resolver   = await endpointMappingResolver.createResolvers({endpoints, mappings, configPath})

   console.log({mappings});
   console.log({protoFiles});
   console.log({endpoints: endpoints.map(e => `${e.getService()} : ${e.getResponse().isStream() ? "stream stresponse" : "unary"}`)});

   for(const name of ['default', 'virat', 'rohit']){
     const response = resolver.getResponseFile('helloworld.greet.Greeter.SayHello', {name});
     console.log('response for ' + name, response);
   }

   console.log({resolver});
   return () => console.log("App exited.")
  }
};