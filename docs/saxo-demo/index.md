**Install devtool**

Install the npm cli tool. Make sure npm module in on system path by running a command.

<video src="01-install.mp4"></video>



**Initialize project**

- Go to projejet directory and run `grpc init`. 
- Enter an output path
- Enter path containing proto files
- Choose files to create default mappings for
- There is a new directory created in project.

<video src="02-grpc-init.mp4"></video>



**Check created `grpc.yaml`**

- This is the file with default values

- All these values can be overrided using command line parameters

- `grpc.yaml`

  ```yaml
  # Address for our server
  host: 'localhost'
  port: '3009'
  
  # We will add adress of real service here
  remoteHost: 'localhost'
  remotePort: '3010'
  
  # Relativ path to any other folder containing our proto files
  protos: ../protos
  
  # While recording sreams, it will save only 10 messages by default
  trimmedStreamSize: 10
  ```

<video src="03-created-grpc.yaml-and-protos.mp4"></video>



**Check created `mappings.yaml` and default repsonses**

- It created a `mapping.yaml` file as 

  ```yaml
  iit.paas.services.fx.FxAutoQuote.GetPrice:
    - data/GetPrice/default.yaml
  
  iit.paas.services.fx.FxAutoQuote.GetPriceStream:
    - data/GetPriceStream/default.yaml
  
  iit.paas.services.fx.FxAutoQuote.GetIncrementalPriceStream:
    - data/GetIncrementalPriceStream/default.yaml
  ```

- And corresponding templates that can return some values for eny endpoint : 

  ```yaml
  request@ : {
    "uic": "@any",
    "spread_set_id": "@any",
    "commission_group_id": "@any",
    "client_class_id": "@any",
    "liquidity_factor_option": "@any",
    "amount": "@any",
    "order_price": "@any",
    "trade_history_amount_option": "@any",
    "accumulated_amount": "@any",
    "buy_sell": "@any",
    "order_type": "@any",
    "order_duration": "@any",
    "field_ids": "@any"
  } 
  
  response@ : {
    "field_values": ["2.3"]
  }
  ```

<video src="04-created-mapping-and-template.mp4"></video>



**Configure app to use devtool server**

- Change the address of remote service in app to use our grpc-devtool server

  ```diff
    "ServiceSettings": {
  -   "gRPCServer": "DEVTCE1-DK1.sys.dom",
  +   "gRPCServer": "localhost",
  -   "gRPCPort": 7903,
  +   "gRPCPort": 3009,
    }
  ```

- Also in `grpc.yaml` set the address of our real service. The devtool will use it to record from remote service.

  ```diff
    host: 'localhost'
    port: '3009'
  
  - remoteHost: ''
  + remoteHost: 'DEVTCE1-DK1.sys.dom'
  - remotePort: ''
  + remotePort: '7903'
  
    protos: ../protos
    trimmedStreamSize: 10
  ```

<video src="05-configure-app-to-use-devtool.mp4"></video>



**Record gRPC interactions** 

- Go to our project and run devtool in record mode

  ```bash
  cd Stub
  grpc record .
  ```

- Make an API call in the app

<video src="06-grpc-record.mp4"></video>



**Map recorded files**

- New files are created in devtool folder under `recorded@`
- Rename and organize these files as per your preferences
- Update the `mapping.yaml` to map them to endpoints

<video src="07-map-recorded-files.mp4"></video>



**Run service against devtool server**

- No stop  the recorder and start devtool in server mode 

  ```bash
  grpc serve .
  ```

<video src="10-run-app-against-recorded.mp4"></video>



 ***Thats it ! Now our app is running against fixed data. Check out the streaming API. It returns the same set of elements circularily.***

![image-20201106220446319](images/dance-of-joy.gif)