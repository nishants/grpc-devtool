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

const endpointResponseReader = (endpointId) => {
  const mappings = {
    'helloworld.greet.Greeter.SayHello' : (call) => {
      return {message : `hello ${call.request.name}`};
    },
    'prices.streaming.Pricing.Subscribe' : (call) => {
      return {stream: [{quote: "quote:one"}, {quote: "quote:two"}, {quote: "quote:three"}]};
    }
  };
  return mappings[endpointId];
};

const createEnpointHandler = ({endpoint, loadedProtofile}) => {
  const handler = async (call, send, endpoint) => {
    const responseCompiler = endpointResponseReader(endpoint.getId());
    const responseSender = getHandler(endpoint);

    const response = responseCompiler(call);
    await responseSender(response)(call, send);
  };

  service.add({protoFile: loadedProtofile, endpoint, onRequest: handler});
};

var service = server.create({host: "0.0.0.0", port: "50053"});


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
  .forEach(createEnpointHandler);

service.start();