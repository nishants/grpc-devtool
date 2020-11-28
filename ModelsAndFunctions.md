# Models 



### Enpdoint

- `getId()`

  <details>
      <summary>getId()</summary>
    	<div>
     		This uniquly identifies a gRPC endpoint. 
        e.g.
  			Enpoint for function described in below prototype would be `greet.Greeter.SayHello`
        ```protobuf
        syntax = "proto3";
        package greet;
          service Greeter {
            rpc SayHello (HelloRequest) returns (HelloReply);
          }

          message HelloRequest {
            string name = 1;
          }
        
          message HelloReply {
            string message = 1;
          }
        
        ```
      
      </div>
  </details>
