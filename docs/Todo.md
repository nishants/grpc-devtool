### Todo

- [ ] Create mono-repo

  > - core
  > - ui
  > - client
  > - app





### Templates with expressions support

- [x] Remove mustache

  > Mustache can not support JS expressions in templates. It only allows key/value pair from variables.
  >
  > i.e. `{{request.body.name}}` is supported but` {{request.body.name.toUpperCase()}}` is not supported

- [x] Setup jeyson templates

  - [x] Make all tests pass
  - [x] Make all tests pass with pricing service.





- [ ] Do not repeat should still publish the given array of stream

- [ ] Instrumentation

  - [ ] Add persistent store : https://github.com/techfort/LokiJS/wiki
  - [ ] Load templates in the store on load
  - [ ] Change the templates dynamically using control api

  

  

### Create control API

- [ ] **grpc-devtool.ControlApi`.GetInvocationsOf(string methodId)`**

  ```yaml
  return {
  	timesCalled: 34,
  	history: [
  		{request: {..}, response: {...}, time: 'iso-time-stamp'}
  	]
  }
  ```

- [ ] **grpc-devtool.ControlApi`.SetResponse(string methodId, request, response)`**

- [ ] **grpc-devtool.ControlApi`.StartServer(string appConfigAsJsonString)`**

- [ ] **grpc-devtool.ControlApi`.StopServer(int portOfServerToStop)`**

- [ ] **grpc-devtool.ControlApi`.StopServer(int stopAllServers)`**

- [ ] **grpc-devtool.ControlApi`.StopStreaming(string methodId, string requestForWhichToStop)`**

- [ ] **grpc-devtool.ControlApi`.StopStreamingForAllRequests(string methodId)`**

- [ ] **grpc-devtool.ControlApi`.Clear()`** : clears everything on current server including invokation history, bindings, stopsStreamingForAllRequests

- [ ] 

- [ ] Create control API for `nodejs` npm module.

- [ ] Create control API for `csharp` nuget package.

  ```csharp
  var grpc = GrpcDevtool.ConnectTo(string address, int port);
  
  grpc.Clear();
  
  grpc.SetResponse<TRequest, TResponse>(
    string methodFullName, 
    TRequest requestTemplate, 
    TResponse responseTemplate
  );
  
  // Do something with server
  // .....
  
  
  int grpc.GetTotalRequestsFor(string methodName);
  
  int grpc.GetTotalRequestsFor<TRequest>(
    string methodName, 
    TRequest requestTemplate
  );
  
  grpc.ExepctToHaveBeenCalled(
  string methodName, 
  	  TRequest requestTemplate,
    	int expectedTimesToBeCalled = -1
  );
  
  grpc.ExepctToHaveBeenCalled(
  string methodName, 
    	int expectedTimesToBeCalled = -1
  );
  ```

  

