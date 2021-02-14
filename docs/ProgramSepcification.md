

- ​	App

  ```javascript
  const appParameters = {
  	host, 
    port, 
    configPath,  // path to dir containing grpc.yml
    protosPath,  // path contining protos files (nested allowed)
    extensionsPath, // Not used right now
    recording,      // When true, app runs in recording mode
    remoteHost,     // Remote host (when recording)
    remotePort,     // Remote port (when recording)
    trimmedStreamSize // Default no of interactions to record (when recording)
  };
  
  ```

  **Remarks on app parametes**

  - Shoul we separate and classify paramertes, e.g. into 
    - **workspace**` (configPath, extensionsPath, protosPath)`
    - **server** `(host, port)`
    - **recorder** `[OPTIONAL] {remoteHost, remotePort}`



 **`app.run`**

```javascript
const mappings        = getMappingsYamlFile()
const prototFileList  = getProtoFiles()
const endpoints       = loadEndptoinsFromProtoFiles(prototFileList)
const dataFiles       = readDataFiles()
const resolver   = await endpointMappingResolver.createResolvers({endpoints, mappings, templates});
const client     = recording ? await Client.create({host : remoteHost, port : remotePort, endpoints}) : null;
const recorder   = recording ? await Recorder.create({configPath}) : null;

```





```
Current : 
- resolver
	- finds a data file matching to a request
  
Change 
- resovler 
```



### resolver 

```javascript
const resolverParameters : {endpoints, mappings, dataFiles};

resolve.getResponseFile =  (endpointId, request) => {
	// Search all datafiles defined for the endpoints
  // ERROR : if no response file found for request
}
```

Responsibilty

- ~~find a data file matching to a request~~ Find a controller to the request

Remarks

- This could return handler instead of file

Required : 

```javascript
const controllerResovler = new Resolver(endpoints);

// Load mappings from mapping.yaml
for(const mapping of mappings){
  const files = mappings[mapping];
  for(const file of files){
     controllerResovler.addHandler(
       mapping.endpointId, 
       new FileHandler(file)
     ); 
  }
}

// 
loadControllersFor()
```





```javascript
cont getResponseForEndpoint =  async (methodFullName, callContext) => {
  // Should be 
  // Find an endpoint object for methodFullName
  // ERROR : endpoint not found in proto files  
  
  // Find controller for the endpoint
  // ERROR : no controller found for endpoint

  // return controller.handle(callContext, handler)
  
  const endpoint = endpoints.find(e => e.getId() === endpointId);
  let request = callContext.request;

  if(endpoint.isStreamingRequest()){
    request = await waitForFirstClientStream(callContext, endpointId);
  }

  const responseFile = resolver.getResponseFile(endpointId, request);
  if(!responseFile){
    // TODO Check for recording mode and invoke recorder
    return null;
  }
  return compileResponseFile(responseFile, callContext);
}
```





**Client**  (when recording)

```
// Used to create grpc client 
```



**Recorder**  (when recording)





Create type Controller 

```
const controller = createConstroller(endpointId, requestSpec, responseTemplate?, responseScript?);

// when actual request is received
controller.handle(endpoint, request);
```



```
ContollerTypes : 
- 
```



- This should replace fil