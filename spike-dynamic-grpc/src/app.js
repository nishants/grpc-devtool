const mappingsReader = require('./mappingsReader');

module.exports = {
  run : ({host, port, configPath, protosPath, extensionsPath}) => {
   console.log('Starting with configuration : ');
   console.log({host, port, configPath, protosPath, extensionsPath});
   const mappings = mappingsReader.readFrom(configPath);

   console.log({mappings});

   return () => console.log("App exited.")
  }
};