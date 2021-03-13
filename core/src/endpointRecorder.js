const path = require('path');
const {writeFile} = require('./utils/files');
const endOfLine = require('os').EOL;

module.exports = {
  create : ({configPath}) => {
    return {
      save : async ({request, response, endpointId}) => {
        const dir = path.join(configPath, 'recorded@');
        const file = `${endpointId}-${Date.now()}.yaml`;
        const json = (data) => JSON.stringify(data, null, 2);

        const content = `request@ : ${json(request)} ${endOfLine + endOfLine}response@ : ${json(response)} `;

        await writeFile(dir, file, content);
      }
    }
  }
};