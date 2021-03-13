const {readYamlFileInDir} = require('./utils/files');
const Template = require('./mappingTemplate');

module.exports = {
  create: ({configPath}) => {
    return {
      get : async (relativePath) => {
        const data = await readYamlFileInDir(configPath, relativePath);
        return Template.create(data);
      }
    };
  }
}