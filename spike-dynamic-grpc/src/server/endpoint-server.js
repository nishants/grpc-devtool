const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

module.exports = {
  create: ({host, port}) => {
    var server = new grpc.Server();
    server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());

    return {
      add : (protoPath, onRequest) => {
        var packageDefinition = protoLoader.loadSync(
          protoPath,
          {keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
          });
        let protofile = grpc.loadPackageDefinition(packageDefinition);
        var hello_proto = protofile.helloworld;
        server.addService(hello_proto.Greeter.service, {sayHello: onRequest});
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