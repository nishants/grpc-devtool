const {getFilesFromDir} = require('./utils/files');

module.exports = {
  readFrom: async (protosPath) => {
    const protoFilesPattern = `${protosPath}/**/*.proto`;
    try {
      const protoFiles = await getFilesFromDir(protoFilesPattern);
      return protoFiles;
    }catch(exception) {
      console.error(`Failed to read protos : "${protosPath}"`);
      throw exception;
    }
  }
}