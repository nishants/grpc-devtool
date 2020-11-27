
module.exports = {
  run : ({host, port, configPath, protosPath, extensionsPath}) => {
   console.log('Starting with configuration : ');
   console.log({host, port, configPath, protosPath, extensionsPath});

   return () => console.log("App exited.")
  }
};