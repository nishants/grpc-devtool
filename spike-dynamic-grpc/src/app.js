const mappingsReader = require('./mappingsReader');
const protosReader = require('./protosReader');
const endpointsLoader = require('./endpointsLoader');
const endpointMappingResolver = require('./endpointMappingResolver');
const TemplateReader = require('./templateReader');
const Server = require('./server/endpoint-server');
const Client = require('./client');

module.exports = {
  run : async ({host, port, configPath, protosPath, extensionsPath, recording, remoteHost, remotePort}) => {
   console.log('Starting with configuration : ');
   console.log({host, port, configPath, protosPath, extensionsPath});

   const mappings   = await mappingsReader.readFrom(configPath);
   const protoFiles = await protosReader.readFrom(protosPath);
   const endpoints  = await endpointsLoader.loadFiles(protoFiles);
   const templates  = TemplateReader.create({configPath});
   const resolver   = await endpointMappingResolver.createResolvers({endpoints, mappings, templates});
   const client     = recording ? await Client.create({host : remoteHost, port : remotePort, endpoints}) : null;

   const compileResponseFile = async (file, callContext)=> {
     const template = await templates.get(file);
     const response = template.getResponse();
     return response.compile();
   };

    const endpointTemplateResponder = {
      getResponse: async (endpointId, callContext) => {
        const responseFile = resolver.getResponseFile(endpointId, callContext.request);
        if(!responseFile){
          return null;
        }
        return compileResponseFile(responseFile, callContext);
      }
    };

    const endpointRecordAndResponder = {
      getResponse: async (endpointId, callContext) => {
        const endpoint = endpoints.find(e => e.getId() === endpointId);
        const response = await client.execute({endpoint, request: callContext});
        console.log("Proxying response : ", response)
        return response;
      }
    };

    const endpointResponder = recording ?  endpointRecordAndResponder : endpointTemplateResponder
   const server = Server.create({host, port, endpointResponder});

   endpoints.forEach(endpoint => {
     server.add(endpoint);
   })

    server.start();

   return () => server.stop();
  }
};