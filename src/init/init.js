const path = require('path');

const endpointsLoader = require('../endpointsLoader');
const protosReader = require('../protosReader');

const {writeYaml} = require('../utils/files');

module.exports = {
  create: async ({outputDir, protosPath}) => {
    const configPath = path.join(outputDir, 'config');
    const protoFiles = await protosReader.readFrom(protosPath);
    const endpoints  = await endpointsLoader.loadFiles(protoFiles);

    const mappings = {};

    for(const endpoint of endpoints){
      mappings[endpoint.getId()] = {};
    }

    await writeYaml(configPath, 'mappings.yaml', mappings);
  }
};