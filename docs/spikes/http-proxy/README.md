

- Setup project 

  ```
  npm init
  npm install --save @grpc/proto-loader @grpc/grpc-js jest
  ```

- Create a proto file : `protos/helloworld.proto`

  ```protobuf
  syntax = "proto3";
  
  package helloworld;
  
  // The greeting service definition.
  service Greeter {
    // Sends a greeting
    rpc SayHello (HelloRequest) returns (HelloReply) {}
  }
  
  // The request message containing the user's name.
  message HelloRequest {
    string name = 1;
  }
  
  // The response message containing the greetings
  message HelloReply {
    string message = 1;
  }
  ```



- Creating server 

  - Load proto file : 

    ```javascript
    const protoLoader = require('@grpc/proto-loader');
    const grpc = require('@grpc/grpc-js');
    const path = require('path');
    
    const PROTO_PATH = path.join(__dirname, 'protos/helloworld.proto');
    
    const packageDefinition = protoLoader.loadSync(
      PROTO_PATH,
      {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      });
    
    const packages = grpc.loadPackageDefinition(packageDefinition);
    
    // Get the proto by package name declared in proto file
    // package helloworld;
    const helloWorldPackage = packages.helloworld;
    ```

  - Define a method to handle client calls  

    ```javascript
    const sayHelloHandler = (call, callback) => {
      callback(null, {message: 'Hello ' + call.request.name});
    }
    ```

  - Start server : 

    ```javascript
    const server = new grpc.Server();
    server.addService(helloWorldPackage.Greeter.service, {sayHello: sayHelloHandler});
    server.bindAsync('0.0.0.0:3009', grpc.ServerCredentials.createInsecure(), () => {
      server.start();
    });
    ```

    