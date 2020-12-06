const path = require('path');

const endpointsLoader = require('../endpointsLoader');
const protosReader = require('../protosReader');
const templateGenerator = require('./templateGenerator');

const {writeYaml, writeFile, copyFile} = require('../utils/files');
const getUniqueSuffixes = require('../utils/getUniqueSuffixes');

const defaultConfig = {
  host: 'localhost',
  port: '3009',
  streamingLoopSize: 10
};

module.exports = {
  create: async ({outputDir, protosPath, protosToMap}) => {
    const configPath = path.join(outputDir, 'config');
    const endpoints  = await endpointsLoader.loadFiles(protosToMap);
    const allProtoFiles = await protosReader.readFrom(protosPath);

    const mappings = {};

    const uniqueSuffixes = getUniqueSuffixes(endpoints.map(e => e.getId()));

    for(let i =0; i < endpoints.length; i++){
      const endpoint = endpoints[i];
      const uniqeId = uniqueSuffixes[i];
      mappings[endpoint.getId()] = [`data/${uniqeId}/default.yaml`];
      const template = templateGenerator.create(endpoint);
      await writeFile(path.join(configPath, 'data' , uniqeId), 'default.yaml', template);
    }

    const config = {
      ...defaultConfig,
      protos : './protos'
    };

    await writeYaml(configPath, 'grpc.yaml', config);
    await writeYaml(configPath, 'mappings.yaml', mappings);

    // Copy all proto files as some may not require mapping but may contain messages
    for(const filePath of allProtoFiles){
      await copyFile(filePath, path.join(configPath, 'protos', path.relative(protosPath, filePath)) );
    }
  }
};