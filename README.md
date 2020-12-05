> WIP - beta expected soon

# gRPC-devtool

[![Build Status](https://dev.azure.com/nishantsingh870743/grpc-devtool/_apis/build/status/nishants.grpc-devtool?branchName=master)](https://dev.azure.com/nishantsingh870743/grpc-devtool/_build/latest?definitionId=1&branchName=master)

[![npm version](https://badge.fury.io/js/grpc-devtool.svg)](https://badge.fury.io/js/grpc-devtool)



**gRPC-devtool** is a cli program to monitor, record and playback gRPC traffic.



**Features** 

- Monitor gRPC traffic
- Record gRPC traffic
- Playback recorded traffic
- Define matcher rules to match and respond to an endpoint
- Use templates to generate responses dynamically
- Support for sessions



### Setup

A sample demonstration of creating a project from [scratch](/doc/demo/create-new) 

- Run as node module

  ```bash
  # Install with npm
  npm install -g grpc-devtool
  
  # Create a project
  grpc create --protos path/to/protos
  
  # Recrod traffic
  grpc record 
  
  # Use as proxy to monitor gRPC traffic
  grpc start
  ```

  Default values : 

  - config : `./config`
  - protos : `./protos`
  - port : `3009`
  - host : `0.0.0.0`

  

- **Run as docker container**

  >  TODO

  

- **Use API in nodejs project**

  > TODO

  


**Sample strucuture of config folder**

```yaml
my-stub/
  - config/
  - mappings.yaml
  - greet/
    - default.yaml
    - rohit.yaml
    - virat.yaml
  - prices/
    - defualt.yaml
  - common/
  - message.yaml
```



### Configurations

Configuration file shoud be placed in the `config` dir and named as `config.yaml`

Example of a cofiguration file : 

```yaml
protos : '../Protos'
host : localhost
port : 3000
trimmedStreamSize : 10
```

All configuration values can be configured at runtime (e.g. in your ci build). 

e.g. 

```
grpc-devtool start --port 50055 --protos 
```



**Configuration options**

| Name              | default        |                                                              |
| ----------------- | -------------- | ------------------------------------------------------------ |
| host              | localhost      | Address of server ran by `grpc-devtool` (use it in you app)  |
| port              | 3009           | Port of server exposed by `grpc-devtool` (use it in you app) |
| protos            |                | Relative or absolute path to the directory containing proto files |
| expressionSymbols | `["{{", "}}"]` | e.g `{{request.body.name}}`                                  |
| sessionEnabled    | `true`         | Enable session support                                       |
| keywordSuffix     | `@`            | ends with `@`                                                |
| trimmedStreamSize | 10             | number for responses for a streaming server to keep in mappings file. Will repeast the responses unless configured otherwise per request basis. |



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