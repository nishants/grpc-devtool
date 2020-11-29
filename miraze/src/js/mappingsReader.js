const {readYamlFile} = require('./utils/files');

module.exports = {
  readFrom: async (configPath) => {
    const expectedMappingsFilePath = `${configPath}/mappings.yaml`;
    try {
      return await readYamlFile(expectedMappingsFilePath);
    }catch(exception) {
      console.error(`Failed to load : "${expectedMappingsFilePath}"`);
      throw exception;
    }
  }
}