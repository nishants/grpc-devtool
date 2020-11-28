# Models 



### Enpdoint

Represents a gRPC endpoint. Idea is that a gRPC endpoint can be uniquely defined as `<package-name>.<service-name>.<method-name>`. It is case sensitive.

```protobuf
// endpoints : <package>.<service>.<method>
//  - greet.Greeter.SayHello
//  - greet.Greeter.SayHelloWorld

syntax = "proto3";

// <package-name>  : "greet"
package greet;

// <service-name>  : "Greeter"
service Greeter {
	// <method-name> : "SayHello"
	rpc SayHello (HelloRequest) returns (HelloReply);
	
  // <method-name> : "SayHelloWorld"
	rpc SayHelloWorld (HelloRequest) returns (HelloReply);
}

message HelloRequest {
	string name = 1;
}

message HelloReply {
	string message = 1;
}
```

**Fields**

- **getId()**

   e.g `greet.Greeter.SayHello`

- **getService()**

  e.g `greet.Greeter`

- **getProtoFile()**

  Returns an object created from `require('@grpc/proto-loader').load(path)` method.

  This object is required when registering the endpoint to grpc server from library `grpc`

  This object is used to read the other fields in endpoint as well.

- **getType()** : EndPointType

  

  

### EndPointType 

Represents a streaming response type can have one of following values : 

 - unary
 - server-streaming
 - client-streaming
 - both-way-streaming

e.g. 

```protobuf
service MultiGreeter {
  // Unary
  rpc sayHello (HelloRequest) returns (stream HelloReply) {}
  
  // Client Streaming
  rpc sayHello (HelloRequest) returns (stream HelloReply) {}
  
  // Server Streaming
  rpc sayHello (stream HelloRequest) returns (HelloReply) {}
  
  // Both Way Streaming
  rpc sayHello (stream HelloRequest) returns (stream HelloReply) {}
}
```



### Template

Represents a yaml template defined for an endpoint. e.g. 

```yaml
request@ : {
  name: "virat"
}

response@ : {
  message : "Hello virat"
}
```

**Constructor** 

Template(matchersFactory, templateCompiler, endpointId)

**Fields**

- **appliesTo(endpointId, callContext, session)** : `boolean` 

   Whether the template applies to a request

- **compileResponse(callContext, session)** : `Map`

  Create response from the request and session



### EndpointHandler

On receiving a request, finds the first template that matches it and returns the response. There are four type of handler created 

- Unary API Handler
- Client Streaming Handler
- Server Streaming Handler
- Both way streaming handler

**Factory** 

EnpointMappingFactory.create(endpointType, templates)

**Fields**

- **appliesTo(endpointType)** : `bool`

  returns true if applies to the endpoint

- **invoke(callContext, callback, session)** : `Map`

  Finds a matching template and serves the endpoint



### EndpointFactory

Read protos from disk and returns an array of endpoints found in all protofiles.

- **readEndpointsFrom(protoDirPath)** : `Endpoint[]`

  Reads all protos in the directory and returns a list of endpoints



### TemplateFactory

- **readTemplatesFrom(configFilePath)** : `Template[]`

  Returns a list of templates that are mapped an endpoint in the `config.yaml`



### Server

Represents a grpc server. For every request finds a endpoint handler and invokes it with the id of endpoint and grpc call context.

**Constructor** 

Server({port, host, options, endpointHandlers, endpoints})

Methods

- `start()`
- `stop()`



**Matcher**

It is used internally by the template to map to a grpc request. It is an interface with methods

- `appliesTo(fieldDefinition)` : boolean

  Whether the matcher is applied to the field definition

- match(fieldDefition, value) : MatchResult



Todo

- [ ] 
- [ ] Create endpoint type
- [ ] Remove unused endpoint fields
- [ ] Remove request/response
- [ ] Create template type and load only once.

### 