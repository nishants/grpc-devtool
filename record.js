const app = require('./src/app');

module.exports = {
  run : (params) => {
    const parameters = {
      host : "0.0.0.0",
      port : "50054",
      configPath : `${process.cwd()}/tests/fixtures/config`,
      protosPath : `${process.cwd()}/tests/fixtures/protos`,
      recording: true,
      remoteHost : "localhost",
      remotePort : "3000",
      streamingLoopSize: 10
    };

    app.run(parameters);
  }
};