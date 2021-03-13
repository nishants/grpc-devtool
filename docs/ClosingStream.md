

Use cases

- `duplex stream` I start a stream based on some message

  - When client sends another request, I want to stop streaming

- `server-stream`

  - based on another call, stop server stream

  



### Stop streaming

- `duplex stream` : Same endpoint starts and stops a stream

  ```yaml
  request@ : {
    "action": "SUBSCRIBE",
    "clientId": "any@"
  }
  
  response@: {
  	stream@: [
  		{messageForClient: "{{request.clientId}}"}
  	],
  	context@: "my-endpoint-{{request.body.clientId}}"
  }
  ```

  

  ```yaml
  request@ : {
    "action": "UNSUBSCRIBE",
    "clientId": "any@"
  }
  
  action@: {
  	stopStreaming@: {
  		context@ : "my-endpoint-{{request.body.clientId}}"
  	}
  }
  ```

-  `server-stream` : when a different point is used to stop streaming 

  

```yaml
request@ : {
  "clientId": "any@"
}

response@: {
	stream@: [
		{message : "message for {{request.body.clientId}}"}
	],
	context@: "my-endpoint-{{request.body.clientId}}"
}
```



```yaml
request@ : {
  "clientId": "any@"
}

action@: {
	stopStreaming@: {
		context@ : "my-endpoint-{{request.body.clientId}}"
	}
}
```



For duplex : 

```yaml
request@ : {
  "action": "SUBSCRIBE",
  "clientId": 2
}

response@: {
	stream@: [
		{messageForClient: "{{request.clientId}}"}
	],
	stopStream@: {
		request@ : {
  		"action": "UNSUBSCRIBE",
  		"clientId": 2
		}
	}
}
```



example

```yaml
# Duplex
request@ : {
  "subscription_details": {
    "type": "SUBSCRIBE",
    "subscription_id": "1",
    "update_rate_ms": 0
  },
}


response@ : {
  "stream@": [
    {
      "subscription_id": "{{request.body.subscription_details.subscription_id}}",
      "result": {
        "field_values": [1.22,1.22,1.22],
        "status": "OK"
      }
    },
    {
      "subscription_id": "{{request.body.subscription_details.subscription_id}}",
      "result": {
      	"field_values": [1.22,1.22,1.22],
        "status": "OK"
      }
    }
  ],
  "doNotRepeat@": false,
  "streamInterval@": 1000,
  "stopStream@" : {
  	 request@: {
  	 	{
        "subscription_details": {
        "type": "SUBSCRIBE",
        "subscription_id": "{{request.body.subscription_details.subscription_id}}",
        "update_rate_ms": 0
    	}
  	 }
  	}
  }
}
```

