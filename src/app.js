const mappingFile = require('./mappingsReader');
const protosReader = require('./protosReader');
const endpointsLoader = require('./endpointsLoader');
const endpointDataFileResolver = require('./endpointMappingResolver');
const TemplateReader = require('./templateReader');
const Server = require('./server/endpoint-server');
const Client = require('./client');
const Recorder = require('./endpointRecorder');
const Controllers = require('./controllers');

module.exports = {
  run : async ({host, port, configPath, protosPath, extensionsPath, recording, remoteHost, remotePort, trimmedStreamSize}) => {
    console.log('Starting with configuration : ');
    console.log({host, port, configPath, protosPath, extensionsPath, recording, remoteHost, remotePort, trimmedStreamSize});

    const mappings   = await mappingFile.readFrom(configPath);
    const protoFileList = await protosReader.readFrom(protosPath);
    const endpoints  = await endpointsLoader.loadFiles(protoFileList);
    const dataFiles  = TemplateReader.create({configPath});

    const mappingResolver = await endpointDataFileResolver.createResolvers({endpoints, mappings, templates: dataFiles});
    const controllers = await Promise.all(endpoints.map((endpoint) => {
      return Controllers.create(endpoint, mappingResolver, dataFiles)
    }));

    const client     = recording ? await Client.create({host : remoteHost, port : remotePort, endpoints}) : null;
    const recorder   = recording ? await Recorder.create({configPath}) : null;

    const waitForFirstClientStream = (callContext, endpointId) => {
      // TODO Full handler for client stream
      // Currently only first message considered
      return new Promise((resolve, reject) => {
        const data = [];
        // TODO Currenlty resolves on  first data from client
        callContext.on('data', (response) => {
          data.push(response)
          resolve(response);
        });
        callContext.on('end', () => {
          if(data.length === 0){
            console.warn(`Empty message received from client at ${endpointId}`);
          }
          resolve({});
        });
      });
    };

    const endpointRecordAndResponder = {
      getResponse: async (endpointId, callContext) => {
        const endpoint = endpoints.find(e => e.getId() === endpointId);
        let request = callContext.request;
        if(endpoint.isStreamingRequest()){
          request = await waitForFirstClientStream(callContext, endpointId);
        }
        const response = await client.execute({endpoint, request, trimmedStreamSize});
        console.log("Proxying response : ", response);
        // TODO handling streaming response should go in template builder:
        const responseTemplate = endpoint.isStreamingResponse() ? {'stream@' : response.stream, 'doNotRepeat@': response.doNotRepeat, 'streamInterval@': response.streamInterval} : response;
        recorder.save({endpointId, request, response : responseTemplate});
        return response;
      }
    };

    const endpointTemplateResponder = {
      getResponse: async (endpointId, callContext, callback) => {
        const controller = controllers.find(controller => controller.canHandle(endpointId));
        if(controller === null){
          throw new Error(`No controller found for ${endpointId}`);
        }
        return controller.handle(callContext, callback);
      }
    };

    const endpointResponder = recording ?  endpointRecordAndResponder : endpointTemplateResponder
    const server = await Server.create({host, port, endpointResponder});
    server.addEndpoints(endpoints);
    server.start();

    return () => server.stop();
  }
};
