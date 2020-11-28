#!/usr/bin/env node

const app = require('./src/app');

const parameters = {
  host : "0.0.0.0",
  port : "50053",
  configPath : `${process.cwd()}/tests/fixtures/config`,
  protosPath : `${process.cwd()}/tests/fixtures/protos`,
};

app.run(parameters);