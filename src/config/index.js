const cliParams  = require('./cliParams');
const projectConfig  = require('./projectConfig');

module.exports = {
  getAppConfig : async (commandLineParams) => {
    const runtimeConfig = cliParams.parse(commandLineParams);
    console.log("User input", runtimeConfig);

    const config = await projectConfig.read(runtimeConfig, process.cwd());
    console.log("Project config", config);

    return  {...runtimeConfig, ...config, recording: true};
  }
};