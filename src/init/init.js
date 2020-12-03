const path = require('path');

const {writeFile} = require('../utils/files');

module.exports = {
  create: async ({outputDir, protosPath}) => {
    const configPath = path.join(outputDir, 'config')
    await writeFile(configPath, 'mappings.yaml', '{}');
  }
};