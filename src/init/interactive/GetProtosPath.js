const fs = require('fs');
const path = require('path');
const protosReader = require('../../protosReader');

module.exports = {
  create : async (prevConfig) => {
    let config = {
      ...prevConfig,
      protoFiles: []
    };

    let nextQuestion =  'Enter path containing your proto files : '
    let error ;
    let getProtosPath = {
      needsMoreInput: () => {
        return !config.protoFiles.length;
      },
      getNextInputQuestion: () => {
        return {
          question : nextQuestion,
          error,
        };
      },
      addInput: async (input) => {
        const protosPath = path.resolve(input);
        if(!fs.existsSync(protosPath)){
          error = `"${input}" does not exist.`
          return;
        }
        const protoFiles = await protosReader.readFrom(protosPath);
        if(!protoFiles.length){
          return error = `No proto files found in "${input}"`
        }
        config = {
          ...config,
          protoFiles
        };
      },
      getConfig: () => {
        return config;
      }
    };

    if(config.protosPath){
      await getProtosPath.addInput(config.protosPath);
    }
    return getProtosPath;
  }
};