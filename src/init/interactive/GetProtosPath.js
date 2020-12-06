const fs = require('fs');
const path = require('path');
const protosReader = require('../../protosReader');
const hasEndpoint = require('../../proto/hasEndpoint');

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
        const protoFileWithEndpoints = [];

        for(const protoFile of protoFiles){
          const needsMapping =  await hasEndpoint(protoFile);
          if(needsMapping){
            protoFileWithEndpoints.push(protoFile);
          }
        }

        if(!protoFiles.length){
          return error = `No proto files found in "${input}"`
        }

        // if(!protoFileWithServices.length){
        //   return error = `None of the protofiles in "${input}" contain a gRPC endpoint.`
        // }
        //
        config = {
          ...config,
          protoFiles: protoFileWithEndpoints
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