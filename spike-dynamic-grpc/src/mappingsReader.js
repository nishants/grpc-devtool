const {readYamlFile} = require('./utils/files');

module.exports = {
  readFrom: async (configPath) => {
    const expectedMappingsFilePath = `${configPath}/mappings.yaml`;
    try {
      const mappings = await readYamlFile(expectedMappingsFilePath);
      console.log({mappings})
    }catch(exception) {
      console.error(`Failed to load : "${expectedMappingsFilePath}"`);
      throw exception;
    }
  }
}