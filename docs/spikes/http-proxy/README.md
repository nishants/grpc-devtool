Todo

- [ ] Create `http://localhost:3009` server
- [ ] is http scheme supported ? : https://github.com/grpc/grpc/blob/master/doc/naming.md
- [ ] try env variable `grpc_proxy`



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

- Creating a client

  - Load the proto file just like we did for sever
  - 

  ```javascript
  const target = 'localhost:3009';
  const client = new helloWorldPackage.Greeter(
    target,grpc.credentials.createInsecure()
  );
  
  client.sayHello({name: "foo-bar"}, function(error, response) {
    if(error){
      return console.error(error);
    }
    console.log('Greeting:', response.message);
  });
  ```

  

### Using http scheme

- What if we just changed above code to 

  ```javascript
  server.bindAsync('http://localhost:3009', grpc.ServerCredentials.createInsecure(), (error) => {
    if(error){
      return console.error(error);
    }
    server.start();
  });
  
  ```

  > Error: Name resolution failed for target dns:http://localhost:3009
  >

- So it tries to use the dns scheme for http. 

- Seems like we can use env variable for this as in here : https://github.com/grpc/grpc-node/blob/bf2e5cb1dd25e43f53605d8de2b8e082072ec23e/packages/grpc-js/src/http_proxy.ts#L45

  ```
  process.env.grpc_proxy="http://localhost:3009"
  ```

  