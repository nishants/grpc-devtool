const fs = require('fs');
const path = require('path');
const protosReader = require('../../protosReader');

module.exports = {
  create : (prevConfig) => {
    let config = {
      ...prevConfig,
      protoFiles: []
    };

    let nextQuestion =  'Enter path containing your proto files : '
    return {
      needsMoreInput: () => {
        return !config.protoFiles.length;
      },
      getNextInputQuestion: () => {
        return nextQuestion;
      },
      addInput: async (input) => {
        const protosPath = path.resolve(input);
        if(!fs.existsSync(protosPath)){
          return nextQuestion = `Entered path "${input}" does not exist. Please enter a valid path : `
        }
        const protoFiles = await protosReader.readFrom(protosPath);
        if(!protoFiles.length){
          return nextQuestion = `Entered path "${input}" does not contain any proto files. Please enter again : `
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
  }
};