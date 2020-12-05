const path = require('path');
const files = require('../utils/files');

module.exports = {
  run: async ()=> {
    const packageJson = await files.readYamlFile(path.join(__dirname, '../../package.json'));
    console.log(packageJson.version);
  }
}