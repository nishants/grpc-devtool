const grpc = require('grpc');

module.exports = {
  create: ({host, port}) => {
    const server = new grpc.Server();
    server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());

    return {
      add : ({protoPath: packageDefinition, endpoint, onRequest}) => {
        const serviceDefinition = grpc.loadPackageDefinition(packageDefinition);
        const procedure = serviceDefinition.helloworld.greet.Greeter.service;

        const requestHandler = (call, callback) => {
          onRequest(call, callback, endpoint);
        };

        server.addService(procedure, {sayHello: requestHandler});
      },
      start: () => {
        server.start();
      },
      stop: () => {
        server.forceShutdown();
      }
    };
  },
};