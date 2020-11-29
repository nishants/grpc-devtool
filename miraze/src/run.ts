const app = require('./js/app.js');

export const run = () => {
    const parameters = {
        host : "0.0.0.0",
        port : "50053",
        configPath : `${process.cwd()}/test/fixtures/config`,
        protosPath : `${process.cwd()}/test/fixtures/protos`,
    };


    app.run(parameters);
}

export default run;