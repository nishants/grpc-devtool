const app = require('../app');
const config = require('../config/index');

module.exports = {
  run : async (commandLineParams) => {
    const appConfig = await config.getAppConfig(commandLineParams);
    app.run({...appConfig, recording: true});
  }
};