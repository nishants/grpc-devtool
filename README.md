# [WIP]



Refer : https://grpc.io/docs/languages/node/basics/



### Todo 

- [ ] Load proto files once only

- [ ] Add test for service with multiple procedures

- [ ] Add test for proto with mutilple services

- [ ] Create configuration files

  - [ ] read from `cwd` by default
  - [ ] ovewrite with arguments
  - [ ] allow proto file path relative to current directory

- [ ] trim streaming responses by config

- [ ] publish npm module

- [ ] All api types
  - [ ] streaming request
  - [ ] both-way-streaming
  
- [ ] Saxo Setup
  - [ ] npm install on saxo
  - [ ] build node docker image
  - [ ] record and playback with prices services
  
- [ ] Analysis 

  - [ ] doc review
  - [ ] spoofing
  - [ ] edge cases

- [ ] Tech debt

  - [ ] build with azure devops
  - [ ] auto publish to npmjs.com (on release branches)
  - [ ] auto publish docker images(on release and master branches)
  - [ ] code coverage
  - [ ] prettier
  - [ ] linter
  - [ ] typescript migration ??

  

- [ ] test with complex protofile definitions for complex (includes proto file). e.g. saxo

- [ ] use numbers in yaml file (fix proto reader)

- [ ] list of values (enums)

- [ ] custom matchers

- [ ] custom script in mapping file

- [ ] custom script with empty body

- [ ] templating language

- [ ] include partial templates

- [ ] read response only when required (do not keep in memory)

- [ ] add flag to limit number for responses to capture

- [ ] add config file

- [ ] add session initialization file

- [ ] handle sessions

- [ ] make keyword configurable

- [ ] handle when no matcher are found for a request.



### Done

- [x] create blueprint
- [x] Define matchers definition `js.yaml`
- [x] e2e tests
- [x] create mapping file reader
- [x] create dynamic client from endpoint
  - [x] for unary
  - [x] for streaming client
- [x] run recorder
- [x] define model 
- [ ] ~~run with node 10.~~
- [x] Create matchers from json
  - [x] for flat object with static fields
  - [x] for flat object with matchers
    - [x] `@any`
    - [x] `@any!`
    - [x] ~~`@ignoreOther`~~
    - [x] ~~js regex~~
  - [ ] ~~for nested objects~~
  - [ ] ~~for arrays~~
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
- [x] add jest
- [x] print protofile definitions with proto packages
- [x] read a directory of proto files
- [x] generate a dynamic handler for each endpoint in each proto file and return random data 
- [x] add a streaming endpoint
- [x] ~~Use this to analyze the dynamically generated client components : https://esprima.org~~



# Blueprint

About it.

Features 

- record and playback gRPC endpoints
- custom matchers and templates
- sessoin support
- run as docker image, cli command or as node module.



Kinds of gRPC API supported

- single request- single response
- single request - streaming response
- streaming request - single response
- streaming request - streaming response



### Installation

- Run as node module

  ```bash
  # Run with default options
  npx miraje 
  
  # Server mappings from config directory
  npx miraje -port 3000 -host 0.0.0.0 -config ./config -protos ./protos
  
  # Record and save responses from remote to ./config/recoding@ 
  npx miraje -port 3000 -host 0.0.0.0 -config ./config -protos ./protos -recording -remotehost: 0.0.0.0 remoteport: 8080
  ```

  Default values : 

  - config : `./config`
  - protos : `./protos`
  - port : `5055`
  - host : `0.0.0.0`

  

- Run as docker image

  ```bash
  # Server mappings from /path/to/config directory
  docker run -p 3000:80 -v /path/to/config:/config saxolab/miraje -host 0.0.0.0 -protos ./protos
  
  # Record and save responses from remote to /path/to/config/recoding@ 
  docker run -p 3000:80 -v /path/to/config:/config saxolab/miraje -host 0.0.0.0 -recording -remotehost: 0.0.0.0 remoteport: 8080 -protos ./protos
  ```

- Install as node module and use api in node tests

  ```bash
  npm install --save miraje
  ```

	Run in player mode: 
  ```javascript
  const app = require('miraze/app');
  
  // Server mappings from /path/to/config directory
  const parameters = {
    host : "0.0.0.0",
    port : "3000",
    configPath : `${process.cwd()}/config`,
    protosPath : `${process.cwd()}/protos`,
  };
  
  app.run(parameters);
  ```

  Run in recorder mode

  ```javascript
  const app = require('miraze/app');
  
  // run in recoding mode
  const parameters = {
    host : "0.0.0.0",
    port : "50054",
    configPath : `${process.cwd()}/tests/fixtures/config`,
    protosPath : `${process.cwd()}/tests/fixtures/protos`,
    recording: true,
    remoteHost : "localhost",
    remotePort : "3000"
  };
  
  app.run(parameters);
  ```




**Sample strucuture of config folder**

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



### Configurations

Configuration file shoud be placed in the `config` dir and named as `config.yaml`

Example of a cofiguration file : 

```yaml
sessionEnabled : true
keywordSuffix : '@'
trimStreaming : 10
```



| Name              | default        |                                                              |
| ----------------- | -------------- | ------------------------------------------------------------ |
| expressionSymbols | `["{{", "}}"]` | e.g `{{request.body.name}}`                                  |
| sessionEnabled    | `true`         |                                                              |
| keywordSuffix     | `/^@/`         | ends with `@`                                                |
| trimStreaming     | 10             | number for responses for a streaming server to keep in mappings file. Will repeast the responses unless configured otherwise per request basis. |



### Defining Mappings

To define a stubbed grpc endpoint, first update the `config/mappings.yaml` in config directory

```yaml
# Name of endpoint and response rules in order
helloworld.greet.Greeter.SayHello : [
  "greet/rohit.js.yaml",
  "greet/virat.js.yaml",
  "greet/default.js.yaml",
]

prices.streaming.Pricing.Subscribe : [
  "prices/211-Stock.js.yaml",
]
```

Remember that the responses are applied in the order declared in mappings file. So if `  "greet/rohit.js.yaml"` matches the request, the response will be returned based on this file.



### Define responses

A simple unary request : 

```yaml
request@ : {
  name: "rohit"
}

response@ : {
  message : "Hello Rohit"
}
```

For a streaming response : 

```yaml
# prices/211-Stock.js.yaml
request@ : {
  uic: 211,
  assetType: "Stock"
}

# Response for a streaming request
response@ : {
  "stream@"  : [
    {quote: "quote:one"}, 
    {quote: "quote:two"}, 
    {quote: "quote:three"}
  ]
}
```



### Using matchers and templates

For some endpoint, it is must to have part of response based on request body. In such case we can use the template : 

```yaml
# Responds to any request
request@ : {
  name: "any@"
}

# Using expressions in response
response@ : {
  message : "Glad to meet you {{request.body.name}}"
}
```



### Including templates

If your response is extremly complex and you need to parameterize certaion parts of it, you can use partial templates. E.g. 

```yaml
request@: {
  uic: 211,
  assetType: "Stock"
}

reply@: {
  stream@: [
    { message: "this is your first message"},
    { message: "this is your second message"},
  
    {
    	# path is relative to config directory
      include@: "shared/message-template.js.yaml",
      param@: {username: "{{request.body.name}}"}
    },
    
  ],
  repeat@: false
}
```



### Scripting in templates

You can add custom script to handle complex scnarios : 

```yaml
request@ : {
	name    : "any@"    
  lastName: "Singh"  
  # applied only if rest of body matches
  # template ignored if it return false
  js@: `
  	return request.matches && request.body.age > 18 
  `
}
```



You can even write your own code to create responses dynamically using javascript : 

```yaml
request@: {
  stream@: [
  {name: "first-user"},
  {name: "second-user"},
  ]
}

@reply: {
  stream@: {
    js@: "
      endpoint.calls = endpoint.calls  || 0;
      endpoint.calls++;
      
      scope.calls = scope.calls  || 0;
      scope.calls++;
      
      var message = `
        hello : ${request.body.name},
        total calls to this endpoint : ${endpoint.calls},
        total replies by this rule : ${scope.calls},
        sequence in stream : ${stream.$index}`;
      
      return {message};
    "
    }
  }
```



### Extensions

You can write your own javascript code to add custom logic to templates. Create a directory `config/ext` and simply put you javascript file there. 



### Create custom matchers 

To create custom matcher, create a file ``config/ext /asset-types.js` as : 

```javascript
const matchers = require('miraje/matchers');

const validAssetTypes = ['Stock', 'CfdOnFutures', 'FxSpot'];

module.exports = {
	appliesTo : (str) => str === 'assetTypes@',
  matches   : (value) => validAssetTypes.includes(value)
}
```



### Sessions

In case you wan't to build a stateful stub (not recommened), you can use sessions.  To enable sessions make sure that`sessionEnabled: true` is set in`config/config.yaml`

Then you can use sessions in your matchers or templates : 

```yaml
request@: {
  name: 'rohit'
}

@reply: {
  stream@: {
    response: {
      message: 'You called me {{session[request.name]}} times.'
    }
    js@: '
      session[request.name] = session[request.name] || 0;
      session[request.name] += session[request.name]; 
    '
    }
  }
```





### Roadmap

- [ ] Test with prices service at saxo
- [ ] Add Oauth
- [ ] Add MTLS