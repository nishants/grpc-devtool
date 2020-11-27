const grpc = require('grpc');
const {get} = require('./getServiceByEndpointId');

module.exports = {
  create: ({host, port}) => {
    const server = new grpc.Server();
    server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());

    return {
      add : ({protoFile: packageDefinition, endpoint, onRequest}) => {
        const definition = grpc.loadPackageDefinition(packageDefinition);
        const procedure = get({definition, endpoint});

        const requestHandler = (call, callback) => {
          onRequest(call, callback, endpoint);
        };

        const methodName = endpoint.getName();
        server.addService(procedure.service, {[methodName]: requestHandler});
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