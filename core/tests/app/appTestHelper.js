const {createClient} = require('../helpers');
const app = require('../../src/app');


module.exports = {
  launchApp : async ({protosPath, configPath, port}) => {
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
