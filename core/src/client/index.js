const grpc = require('@grpc/grpc-js');
const MAX_STREAM_RECORDING_DURATION = 10000;

const {getPathFromObject} = require('../../src/utils/objects');

const {
  Unary,
  ServerStreaming,
  BothWayStreaming,
  getType
} = require('../proto/EndpointTypes');

const handleServerStreaming = ({call, trimmedStreamSize, data: stream, endpoint, resolve, reject})  => {
  let lastStreamTime = Date.now();
  let minStreamTime = 1000;

  call.on('data', (response) => {
    minStreamTime = Math.min(minStreamTime, Date.now() - lastStreamTime);
    lastStreamTime = Date.now();
    console.log("Received message from remote server ", response);
    stream.push(response);
    if (trimmedStreamSize <= stream.length) {
      console.log(`Stopping to record ${endpoint} as streaming loop size is set to ${trimmedStreamSize}.`)
      return resolve({stream, streamInterval: minStreamTime, doNotRepeat: false});
    }
  });

  const timeoutStream = () => {
    if(!stream.length){
      console.warn(`No server stream found for ${endpoint} after ${MAX_STREAM_RECORDING_DURATION/1000} seconds.`);
      return;
    }
    resolve({stream, streamInterval: minStreamTime, doNotRepeat: false});
    console.log(`Closing stream recording for ${endpoint.getId()}`)
  };

  setTimeout(timeoutStream, MAX_STREAM_RECORDING_DURATION);


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
  [ServerStreaming] : ({endpointClient, request, endpoint, trimmedStreamSize})=> {
    return new Promise((resolve, reject) => {
      const data = [];
      const call = endpointClient[endpoint.getName()](request);
      handleServerStreaming({call, trimmedStreamSize, data, endpoint, resolve, reject});
    });
  },
  [BothWayStreaming] : ({endpointClient, request, endpoint, trimmedStreamSize})=> {
    return new Promise((resolve, reject) => {
      const data = [];
      const call = endpointClient[endpoint.getName()]();
      call.write(request);
      handleServerStreaming({call, trimmedStreamSize, data, endpoint, resolve, reject});
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
      execute : async ({endpoint, request, trimmedStreamSize}) =>{
        const endpointClient = endpointClients[endpoint.getId()];
        return await clientTypeHandlers[getType(endpoint)]({endpointClient, request, endpoint, trimmedStreamSize});
      }
    }
  }
}
