const grpc = require('@grpc/grpc-js');
const {getPathFromObject} = require('../utils/objects');
const {getHandlerFor} = require('./endpointHandlerTypes');

module.exports = {
  create: async ({host, port, endpointResponder}) => {
    const server = new grpc.Server();
    await new Promise((resolve) => {
      server.bindAsync(`${host}:${port}`, grpc.ServerCredentials.createInsecure(), resolve);
    })

    return {
      addEndpoints: (endpoints) => {
        const services = {};
        endpoints.forEach(endpoint => {
          const definition = grpc.loadPackageDefinition(endpoint.getLoadedProto());
          const procedure = getPathFromObject({object: definition, path: endpoint.getService()});

          const requestHandler = async (call, callback) => {
            endpointResponder.getResponse(endpoint.getId(), call, callback);
            // const response = await endpointResponder.getResponse(endpoint.getId(), call, callback);
            // const responseSender = getHandlerFor(endpoint);
            // await responseSender(response)(call, callback);
          };

          const methodName = endpoint.getName();

          services[endpoint.getService()] = services[endpoint.getService()] || {service : null, methods: {}};
          services[endpoint.getService()].methods[methodName] = requestHandler;
          services[endpoint.getService()].service = procedure.service;
        });

        Object.keys(services).forEach (service => {
          server.addService(services[service].service, services[service].methods);
        });
        // server.addService(procedure.service, {[methodName]: requestHandler});
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
