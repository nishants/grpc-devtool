const path = require('path');

const endpointsLoader = require('../endpointsLoader');
const protosReader = require('../protosReader');
const templateGenerator = require('./templateGenerator');

const {writeYaml, writeFile, copyFile} = require('../utils/files');
const getUniqueSuffixes = require('../utils/getUniqueSuffixes');

const defaultConfig = {
  host: 'localhost',
  port: '3009',
  trimmedStreamSize: 10,
  remoteHost: '',
  remotePort: '',
  protos : './protos'
};

module.exports = {
  create: async ({outputDir, protosPath, protosToMap}) => {
    const endpoints  = await endpointsLoader.loadFiles(protosToMap);
    const allProtoFiles = await protosReader.readFrom(protosPath);

    const mappings = {};

    const uniqueSuffixes = getUniqueSuffixes(endpoints.map(e => e.getId()));

    for(let i =0; i < endpoints.length; i++){
      const endpoint = endpoints[i];
      const uniqeId = uniqueSuffixes[i];
      mappings[endpoint.getId()] = [`data/${uniqeId}/default.yaml`];
      const template = templateGenerator.create(endpoint);
      await writeFile(path.join(outputDir, 'data' , uniqeId), 'default.yaml', template);
    }

    const config = {
      ...defaultConfig,
    };

    await writeYaml(outputDir, 'grpc.yaml', config);
    await writeYaml(outputDir, 'mappings.yaml', mappings);

    // Copy all proto files as some may not require mapping but may contain messages
    for(const filePath of allProtoFiles){
      await copyFile(filePath, path.join(outputDir, 'protos', path.relative(protosPath, filePath)) );
    }
  }
};