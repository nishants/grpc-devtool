const path = require('path');

const endpointsLoader = require('../endpointsLoader');
const protosReader = require('../protosReader');
const templateGenerator = require('./templateGenerator');

const {writeYaml, writeFile} = require('../utils/files');

const defaultConfig = {

};

module.exports = {
  create: async ({outputDir, protosPath}) => {
    const configPath = path.join(outputDir, 'config');
    const protoFiles = await protosReader.readFrom(protosPath);
    const endpoints  = await endpointsLoader.loadFiles(protoFiles);

    const mappings = {};

    for(const endpoint of endpoints){
      mappings[endpoint.getId()] = [`${endpoint.getId()}/default.yaml`];
      const template = templateGenerator.create(endpoint);
      await writeFile(path.join(configPath, endpoint.getId()), 'default.yaml', template);
    }

    await writeYaml(configPath, 'config.yaml', defaultConfig);
    await writeYaml(configPath, 'mappings.yaml', mappings);
  }
};