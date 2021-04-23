

There are three kind of schemes as discoverd so far  :

- `dns`
  - [x] support in server
  - [x] support in client(recorder)
- `http`
  - [ ] support in server
  - [ ] support in client(recorder)
- `https`



Support for `http` scheme

- discoverd in saxo INCA project

- Seems like there are channel options for http target : `'grpc.http_connect_target': uriToString(target),`

- From the code here : https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/src/http_proxy.ts

  ```javascript
    const extraOptions: ChannelOptions = {
      'grpc.http_connect_target': uriToString(target),
    };
    if (proxyInfo.creds) {
      extraOptions['grpc.http_connect_creds'] = proxyInfo.creds;
    }
    return {
      target: {
        scheme: 'dns',
        path: proxyInfo.address,
      },
      extraOptions: extraOptions,
    };
  }
  ```

  

All channel options: https://github.com/grpc/grpc-node/blob/master/packages/grpc-js/src/channel-options.ts

```typescript
 interface ChannelOptions {
  'grpc.ssl_target_name_override'?: string;
  'grpc.primary_user_agent'?: string;
  'grpc.secondary_user_agent'?: string;
  'grpc.default_authority'?: string;
  'grpc.keepalive_time_ms'?: number;
  'grpc.keepalive_timeout_ms'?: number;
  'grpc.keepalive_permit_without_calls'?: number;
  'grpc.service_config'?: string;
  'grpc.max_concurrent_streams'?: number;
  'grpc.initial_reconnect_backoff_ms'?: number;
  'grpc.max_reconnect_backoff_ms'?: number;
  'grpc.use_local_subchannel_pool'?: number;
  'grpc.max_send_message_length'?: number;
  'grpc.max_receive_message_length'?: number;
  'grpc.enable_http_proxy'?: number;
  'grpc.http_connect_target'?: string;
  'grpc.http_connect_creds'?: string;
  'grpc-node.max_session_memory'?: number;
  [key: string]: any;
}

export const recognizedOptions = {
  'grpc.ssl_target_name_override': true,
  'grpc.primary_user_agent': true,
  'grpc.secondary_user_agent': true,
  'grpc.default_authority': true,
  'grpc.keepalive_time_ms': true,
  'grpc.keepalive_timeout_ms': true,
  'grpc.keepalive_permit_without_calls': true,
  'grpc.service_config': true,
  'grpc.max_concurrent_streams': true,
  'grpc.initial_reconnect_backoff_ms': true,
  'grpc.max_reconnect_backoff_ms': true,
  'grpc.use_local_subchannel_pool': true,
  'grpc.max_send_message_length': true,
  'grpc.max_receive_message_length': true,
  'grpc.enable_http_proxy': true,
  'grpc-node.max_session_memory': true,
};

```

