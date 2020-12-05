const fs = require('fs');
const path = require('path');

module.exports = {
  create : (prevConfig) => {
    let config = {
      ...prevConfig,
      protosPath: null
    };

    let nextQuestion =  'Enter path containing your proto files : '
    return {
      needsMoreInput: () => {
        return !config.protosPath;
      },
      getNextInputQuestion: () => {
        return nextQuestion;
      },
      addInput: (input) => {
        const protosPath = path.resolve(input);
        if(!fs.existsSync(protosPath)){
          return nextQuestion = `Entered path "${input}" does not exist. Please enter a valid path : `
        }
        config = {
          ...config,
          protosPath
        };
      },
      getConfig: () => {
        return config;
      }
    };
  }
};