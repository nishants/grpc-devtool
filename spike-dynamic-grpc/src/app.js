const mappingsReader = require('./mappingsReader');
const protosReader = require('./protosReader');
const endpointsLoader = require('./endpointsLoader');

module.exports = {
  run : async ({host, port, configPath, protosPath, extensionsPath}) => {
   console.log('Starting with configuration : ');
   console.log({host, port, configPath, protosPath, extensionsPath});

   const mappings   = await mappingsReader.readFrom(configPath);
   const protoFiles = await protosReader.readFrom(protosPath);
   const endpoints  = await endpointsLoader.loadFiles(protoFiles);

   console.log({mappings});
   console.log({protoFiles});
   console.log({endpoints: endpoints.map(e => `${e.getService()} : ${e.getResponse().isStream() ? "stream stresponse" : "unary"}`)});

   return () => console.log("App exited.")
  }
};