const grpc = require('grpc');
const {getPathFromObject} = require('../../src/utils/objects');

const {
  Unary,
  ServerStreaming,
  BothWayStreaming,
  getType
} = require('../proto/EndpointTypes');

const handleServerStreaming = ({call, streamingLoopSize, data, endpoint, resolve, reject})  => {
  call.on('data', (response) => {
    if (streamingLoopSize <= data.length) {
      console.log(`Stopping to record ${endpoint} as streaming loop size is set to ${streamingLoopSize}.`)
      return resolve({stream: data});
    }
    //TODO : invokes ever after resolving streamingLoopSize above
    console.log("Received message from remote server ", response);
    data.push(response);
  });

  call.on('end', () => {
    resolve({stream: data});
  });

  call.on('error', (error) => {
    reject({data, error});
  });
};

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
  [ServerStreaming] : ({endpointClient, request, endpoint, streamingLoopSize})=> {
    return new Promise((resolve, reject) => {
      const data = [];
      const call = endpointClient[endpoint.getName()](request);
      handleServerStreaming({call, streamingLoopSize, data, endpoint, resolve, reject});
    });
  },
  [BothWayStreaming] : ({endpointClient, request, endpoint, streamingLoopSize})=> {
    return new Promise((resolve, reject) => {
      const data = [];
      const call = endpointClient[endpoint.getName()]();
      call.write(request);
      handleServerStreaming({call, streamingLoopSize, data, endpoint, resolve, reject});
    });
  }

};

module.exports = {
  create: async ({host, port, endpoints}) => {
    const endpointClients = {};
    const credentials = grpc.credentials.createInsecure();

    const createGrpcClient = async (endpoint) => {
      const protoDefinition = grpc.loadPackageDefinition(endpoint.getLoadedProto());
      const servicePackage = getPathFromObject({object: protoDefinition, path : endpoint.getPackageName()})

      return new servicePackage[endpoint.getServiceName()](`${host}:${port}`, credentials);
    };

    for(const endpoint of endpoints){
      endpointClients[endpoint.getId()] = await createGrpcClient(endpoint);
    }

    return {
      execute : async ({endpoint, request, streamingLoopSize}) =>{
        const endpointClient = endpointClients[endpoint.getId()];
        return await clientTypeHandlers[getType(endpoint)]({endpointClient, request, endpoint, streamingLoopSize});
      }
    }
  }
}