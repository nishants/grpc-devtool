const grpc = require('grpc');
const {getPathFromObject} = require('../../src/utils/objects');

const {
  Unary,
  ServerStreaming,
  BothWayStreaming,
  getType
} = require('../proto/EndpointTypes');

const handleServerStreaming = ({call, streamingLoopSize, data: stream, endpoint, resolve, reject})  => {
  let lastStreamTime = Date.now();
  let minStreamTime = 1000;

  call.on('data', (response) => {
    if (streamingLoopSize < stream.length) {
      console.log(`Stopping to record ${endpoint} as streaming loop size is set to ${streamingLoopSize}.`)
      call.cancel();
      return resolve({stream, streamInterval: minStreamTime});
    }
    minStreamTime = Math.min(minStreamTime, Date.now() - lastStreamTime);
    lastStreamTime = Date.now();
    console.log("Received message from remote server ", response);
    stream.push(response);
  });

  call.on('end', () => {
    resolve({stream, doNotRepeat: true, streamInterval: minStreamTime});
  });

  call.on('error', (error) => {
    reject({stream, error});
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