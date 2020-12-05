const path = require('path');

const endpointsLoader = require('../endpointsLoader');
const protosReader = require('../protosReader');
const templateGenerator = require('./templateGenerator');

const {writeYaml, writeFile, copyFile} = require('../utils/files');

const defaultConfig = {
  host: 'localhost',
  port: '3009',
  streamingLoopSize: 10
};

module.exports = {
  create: async ({outputDir, protosPath, protosToMap}) => {
    const configPath = path.join(outputDir, 'config');
    const endpoints  = await endpointsLoader.loadFiles(protosToMap);

    const mappings = {};

    for(const endpoint of endpoints){
      mappings[endpoint.getId()] = [`${endpoint.getId()}/default.yaml`];
      const template = templateGenerator.create(endpoint);
      await writeFile(path.join(configPath, endpoint.getId()), 'default.yaml', template);
    }

    const config = {
      ...defaultConfig,
      protos : './protos'
    };

    await writeYaml(configPath, 'grpc.yaml', config);
    await writeYaml(configPath, 'mappings.yaml', mappings);

    for(const filePath of protosToMap){
      await copyFile(filePath, path.join(configPath, 'protos', filePath.replace(protosPath, '')) );
    }
  }
};