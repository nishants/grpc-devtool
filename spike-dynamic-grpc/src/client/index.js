const grpc = require('grpc');
const {getPathFromObject} = require('../../src/utils/objects');

const {
  Unary,
  ServerStreaming,
  getType
} = require('../proto/EndpointTypes');

const clientTypeHandlers = {
  [Unary] : ({endpointClient, request, endpoint})=> {
    return new Promise((resolve, reject) => {
      endpointClient[endpoint.getName()](request, function(err, response) {
        if(err) {
          return reject(err);
        }
        resolve(response);
      });
    });
  },
  [ServerStreaming] : (endpoint, request)=> {

  }
};

module.exports = {
  create: async ({host, port, endpoints}) => {
    const endpointClients = {};
    const credentials = grpc.credentials.createInsecure();

    const createGrpcClient = async (endpoint) => {
      const protoDefinition = grpc.loadPackageDefinition(endpoint.getLoadedProto());
      const servicePackage = getPathFromObject({object: protoDefinition, path : endpoint.getPackageName()})
      const client = new servicePackage[endpoint.getServiceName()](`${host}:${port}`, credentials);

      return client;
    };

    for(const endpoint of endpoints){
      endpointClients[endpoint.getId()] = await createGrpcClient(endpoint);
    }

    return {
      execute : async ({endpoint, request}) =>{
        const endpointClient = endpointClients[endpoint.getId()];
        return await clientTypeHandlers[getType(endpoint)]({endpointClient, request, endpoint});
      }
    }
  }
}