#!/usr/bin/env node

const app = require('./src/app');

const parameters = {
  host : "0.0.0.0",
  port : "3000",
  configPath : `${process.cwd()}/tests/fixtures/config`,
  protosPath : `${process.cwd()}/tests/fixtures/protos`,
  streamingLoopSize: 10
};

app.run(parameters);