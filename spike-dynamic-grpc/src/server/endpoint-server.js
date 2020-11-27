const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');


module.exports = {
  create: ({host, port}) => {
    const server = new grpc.Server();
    server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());

    return {
      add : ({protoPath, endpoint, onRequest}) => {
        const packageDefinition = protoLoader.loadSync(
          protoPath,
          {keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
          });

        const protofile = grpc.loadPackageDefinition(packageDefinition);
        const hello_proto = protofile.helloworld.greet;

        const requestHandler = (call, callback) => {
          onRequest(call, callback, endpoint);
        };

        server.addService(hello_proto.Greeter.service, {sayHello: requestHandler});
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