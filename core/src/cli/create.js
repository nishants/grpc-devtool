const init = require('../init');
const cliParams = require('../config/cliParams');

module.exports = {
  run : async (cliInput) => {
    const cliConfig = await cliParams.parse(cliInput);
    init.createProject(cliConfig)
  }
};