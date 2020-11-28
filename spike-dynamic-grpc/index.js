const path = require('path');
const protoLoader = require('@grpc/proto-loader');

const server = require('./src/server/endpoint-server');
const analyzer = require('./src/proto/proto-analyzer');

const pricesProtoFile = path.join(__dirname , './tests/fixtures/protos/prices.proto');
const helloWorldProtoFile = path.join(__dirname , './tests/fixtures/protos/helloworld.proto');

const protoFiles = [pricesProtoFile, helloWorldProtoFile];

const loadFile = (protoFilePath) => {
  return protoLoader.loadSync(
    protoFilePath,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
};

const getHandler = (endpoint) => {
  const type = endpoint.getResponse().isStream() ? "response-stream" : "unary";

  const handlerTypes = {
    "unary" : (response) => {
      return (call, send) => {
        send(null, response);
      };
    },
    "response-stream" : (response) => {
      return async (call) => {
        const responses = [...response.stream, {end: true}];
        for(let i =0; i < responses.length; i++){
          await new Promise((resolve => setTimeout(resolve, 500)));
          const response = responses[i];
          if(response.end) {
            call.end();
          }
          else {
            call.write(response);
          }
        }
      };
    }
  };

  return handlerTypes[type];
}

const endpointResponseReader = async (endpointId) => {
  const mappings = {
    'helloworld.greet.Greeter.SayHello' : async (call) => {
      return {message : `hello ${call.request.name}`};
    },
    'prices.streaming.Pricing.Subscribe' : async (call) => {
      return {stream: [{quote: "quote:one"}, {quote: "quote:two"}, {quote: "quote:three"}]};
    }
  };
  return mappings[endpointId];
};

const endpointResponder = {
  getResponse: async (endpointId, callContext) => {
    const responseCompiler = await endpointResponseReader(endpointId);
    const response = await responseCompiler(callContext);
    return response;
  }
};

var service = server.create({host: "0.0.0.0", port: "50053", endpointResponder});

// Add handler for each endpoint in each proto file,
protoFiles
  .map(file => {
    const loadedProtofile = loadFile(file);
    return analyzer.readProto(loadedProtofile).map(endpoint => ({
      endpoint,
      loadedProtofile
    }));
  })
  .reduce((arr, files) => [...arr, ...files], [])
  .forEach(d => {
    service.add({protoFile: d.loadedProtofile, endpoint: d.endpoint});
  });

service.start();