Refer : https://grpc.io/docs/languages/node/basics/



Todo 

- [ ] Define matchers definition `js.yaml`
- [ ] Create matchers from json
  - [ ] for flat object with static fields
  - [ ] for flat object with matchers
    - [ ] `@any`
    - [ ] `@any!`
    - [ ] `@ignoreOther`
    - [ ] js regex
  - [ ] for nested objects
  - [ ] for arrays
- [ ] Handle request headers in matchers
- [x] Create test for server
- [x] Create endpoint handler dynamically
- [x] Create endpoint handler
  - [x] dynmically capture the endpoint requests
  - [x] return custom data
  - [x] for streaming response
  - [ ] for streaming requests
  - [ ] for two way streaming
  - [ ] test for all protobus types
  - [ ] add protobuf include type
- [x] creat two set of protofiles
  - [x] single request - single response
  - [x] single request - streaming response
- [x] print protofile definitions for simple protobufs
- [x] Infer followign details for a proto file
  - [x] request field and types
  - [x] reply field and types
  - [x] request is streamin ?
  - [x] response is streamin ?
  - [x] endpoint name.
- [ ] add jest
- [ ] print protofile definitions with proto packages
- [ ] print protofile definitions for complex (includes proto file). e.g. saxo
- [ ] read a directory of proto files
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



```js
//Get service from protofile 
var protoLoader = require('@grpc/proto-loader');

var loadServices = (protoFilePath) => {
  const protofile = protoLoader.loadSync(
    protoFilePath,
    {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
  var isService = member => ! member.format;

  return Object.values(protofile).filter(isService).reduce((group, thiz) => {
    return [...group, ...Object.values(thiz)]
  }, []);
}

loadServices('./protos/greet.proto');
```



### Finding

- service protobuf memtber also contains the request and response.



### Dynamic gRPC endpoint

```
npm install --save grpc
```



```javascript

var grpc = require('grpc');
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

var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;
function sayHello(call, callback) {
  callback(null, {message: 'Hello ' + call.request.name});
}

var server = new grpc.Server();
server.addService(hello_proto.Greeter.service, {sayHello: sayHello});
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
```



```bash
npx miraje -port 3002 -config ./config -protos ../src/protos
```



|                  | Map by protofile                                             | Map by procedure path                                        |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Example          | `protofile: $proto/greet.proto`                              | `procedure : package.service.methodname`                     |
| Ease of creation | very simple, but user will still have to read through the protobuf if creating there own response defintion | Needs user to look into proto files and understand before defining results |
| recording        |                                                              | even for procudure path we can generate mapping while recording |
| integritiy       | can cause issues and complexity for smartly matching a request by file type only | **ROBUST**                                                   |

### Config file

```yaml
# Profile file path relative to proto home
# proto home passed as runtimg parameter
# protofile: $proto/greet.proto


# Mapping files are applied in specified order 
# till there is a match
package.service.methodname : [
	"greet/rohit.js.yaml",
  "greet/virat.js.yaml",
  "greet/default.js.yaml",
]

# any number for related/unreleated methods names in a single mapping file
package.service.methodname2 : [
  "common/message.js.yaml",
]

# intial value of session (should be seprate file ?)
session: {
	knonwnUsers: [{id: "hello", token: "abc"}],
}
```

- defined in `config` dir passed at runtime (directly inside it)

```yaml
# Sample directory structure : 

stub/
	- config/
		- mappings.yaml
		- greet/
			- default.js.yaml
      - rohit.js.yaml
      - virat.js.yaml
		- prices/
    	- defualt.js.yaml
    - common/
    	- message/js.yml
```



### A sample matcher definition

Matcher keywords

|         |                            |      |
| ------- | -------------------------- | ---- |
| `any@`  | Any value (including null) |      |
| `any!@` | Any non null value         |      |
|         |                            |      |
|         |                            |      |



```yaml
request@ : {
	ignoreOther@ : true # ignore fields in data not defined here
	name    : "any@"    # any string value 
  lastName: /^Singh/  # regex field
  age     : "any@"    # any integer value
  location: "India"   # fixed value  
  address : {
  	city  : 'varanasi' # fixed nested object 
		pin   : "any@"     # nested directive
  },
  header@ : {
  	token : 'any!@',  # any value but not null
  }
  # applied if rest of body matches
  js@: `
  	return request.matches && request.body.age > 18 
  `
}
```





In Future : 

- [ ] Add Oauth
- [ ] Add certificates 
- [ ] Add dynamic client and start recording 