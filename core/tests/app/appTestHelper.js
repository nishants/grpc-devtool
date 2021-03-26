const {createClient} = require('../helpers');

let nextPort = 50053;

module.exports = {
  launchApp : async ({protosPath, configPath, port= nextPort++}) => {
    const app = require('../../src/app');
    const host= "0.0.0.0";
    const appParameters = {host, port, configPath, protosPath};

    const closeApp = await app.run(appParameters);
    const client = createClient(`${host}:${port}`);

    return {
      closeApp,
      client
    }
  }
};
