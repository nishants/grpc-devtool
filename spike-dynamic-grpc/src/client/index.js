var grpc = require('grpc');

module.exports = {
  create: async ({host, port, endpoints}) => {
    const endpointClients = {};
    const credentials = grpc.credentials.createInsecure();

    const createGrpcClient = async (endpoint) => {
      const protoDefinition = grpc.loadPackageDefinition(endpoint.getLoadedProto()).helloworld.greet;
      const client = new protoDefinition.Greeter(`${host}:${port}`, credentials);
      return client;
    };

    for(const endpoint of endpoints){
      endpointClients[endpoint.getId()] = await createGrpcClient(endpoint);
    }

    return {
      execute : async ({endpoint, request}) => new Promise((resolve, reject) => {
        const endpointClient = endpointClients[endpoint.getId()];
        const clientMethod = endpointClient[endpoint.getName()];

        endpointClient[endpoint.getName()](request, function(err, response) {
          if(err) {
            return reject(err);
          }
          resolve(response);
        });
      })
    }
  }
}