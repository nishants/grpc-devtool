

module.exports = {
  create : (prevConfig) => {
    let config = {
      ...prevConfig,
      hostPort: null
    };

    const defaultHost = 'localhost:3009'

    return {
      needsMoreInput: () => {
        return !config.hostPort;
      },
      getNextInputQuestion: () => {
        return {
          question : 'Enter the devtool server host:port',
          default  : defaultHost
        };
      },
      addInput: (hostPort) => {
        config = {
          ...config,
          hostPort: hostPort.trim() || defaultHost
        };
      },
      getConfig: () => {
        return config;
      }
    };
  }
};