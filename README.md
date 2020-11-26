Todo 

- [x] creat two set of protofiles
  - [x] single request - single response
  - [x] single request - streaming response
- [ ] print protofile definitions for simple protobufs
- [ ] print protofile definitions for complex (includes proto file). e.g. saxo
- [ ] read a directory of proto files
- [ ] 
- [ ] generate a dynamic handler for each endpoint in each proto file and return random data 
- [ ] add a streaming endpoint
- [ ] Use this to analyze the dynamically generated client components : https://esprima.org/



### Loading and analyzing proto files

```
npm install --save @grpc/proto-loader
```

```javascript
var protoLoader = require('@grpc/proto-loader');
var protofilePath =  './protos/greet.proto';
var protoFile = protoLoader.loadSync(
    protofilePath,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

Object.keys(protoFile)
// [ 'greet.Greeter', 'greet.HelloRequest', 'greet.HelloReply' ]

Object.keys(protoFile['greet.Greeter'])
// [ 'SayHello' ]

protoFile['greet.Greeter'].SayHello
/*
{
  SayHello: {
    path: '/greet.Greeter/SayHello',
    requestStream: false,
    responseStream: false,
    requestSerialize: [Function: serialize],
    requestDeserialize: [Function: deserialize],
    responseSerialize: [Function: serialize],
    responseDeserialize: [Function: deserialize],
    originalName: 'sayHello',
    requestType: {
      format: 'Protocol Buffer 3 DescriptorProto',
      type: [Object],
      fileDescriptorProtos: [Array]
    },
    responseType: {
      format: 'Protocol Buffer 3 DescriptorProto',
      type: [Object],
      fileDescriptorProtos: [Array]
    }
  }
}
*/

protoFile['greet.HelloRequest']
/*
{
  format: 'Protocol Buffer 3 DescriptorProto',
  type: {
    field: [ [Object] ],
    nestedType: [],
    enumType: [],
    extensionRange: [],
    extension: [],
    oneofDecl: [],
    reservedRange: [],
    reservedName: [],
    name: 'HelloRequest',
    options: null
  },
  fileDescriptorProtos: [
    <Buffer 0a 0b 67 72 65 65 74 2e 70 72 6f 74 6f 12 05 67 72 65 65 74 22 1c 0a 0c 48 65 6c 6c 6f 52 65 71 75 65 73 74 12 0c 0a 04 6e 61 6d 65 18 01 20 01 28 09 ... 102 more bytes>
  ]
}
*/

protoFile['greet.HelloReply']
/*
{
  format: 'Protocol Buffer 3 DescriptorProto',
  type: {
    field: [ [Object] ],
    nestedType: [],
    enumType: [],
    extensionRange: [],
    extension: [],
    oneofDecl: [],
    reservedRange: [],
    reservedName: [],
    name: 'HelloReply',
    options: null
  },
  fileDescriptorProtos: [
    <Buffer 0a 0b 67 72 65 65 74 2e 70 72 6f 74 6f 12 05 67 72 65 65 74 22 1c 0a 0c 48 65 6c 6c 6f 52 65 71 75 65 73 74 12 0c 0a 04 6e 61 6d 65 18 01 20 01 28 09 ... 102 more bytes>
  ]
}
*/

// Get all services 
Object.values(protoFile).filter(isService).reduce((group, thiz) => {
    return [...group, ...Object.values(thiz)]
}, []);
```



```yaml
//Definition to print

{name: "SayHello", type: "Service", request: "HelloRequest", resply: "HelloReply" },

{name: "HelloRequest", type: "Service", request: "HelloRequest", resply: "HelloReply" }


```



### Finding

- service protobuf memtber also contains the request and response.





In Future : 

- [ ] Add Oauth
- [ ] Add certificates 
- [ ] Add dynamic client and start recording 