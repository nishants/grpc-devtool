const grpc = require('grpc');
const {get} = require('./getServiceByEndpointId');
const {getHandlerFor} = require('./endpointHandlerTypes');

module.exports = {
  create: ({host, port, endpointResponder}) => {
    const server = new grpc.Server();
    server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());

    return {
      add : ({protoFile: packageDefinition, endpoint}) => {
        const definition = grpc.loadPackageDefinition(packageDefinition);
        const procedure = get({definition, endpoint});


        const requestHandler = async (call, callback) => {
          const response = await endpointResponder.getResponse(endpoint.getId(), call);
          const responseSender = getHandlerFor(endpoint);
          await responseSender(response)(call, callback);
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