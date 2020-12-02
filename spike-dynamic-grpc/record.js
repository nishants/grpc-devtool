#!/usr/bin/env node

const app = require('./src/app');

const parameters = {
  host : "0.0.0.0",
  port : "50054",
  configPath : `${process.cwd()}/tests/fixtures/config`,
  protosPath : `${process.cwd()}/tests/fixtures/protos`,
  recording: true,
  remoteHost : "localhost",
  remotePort : "3000"
};

app.run(parameters);