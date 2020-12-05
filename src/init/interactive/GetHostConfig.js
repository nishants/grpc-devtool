

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
        return `Enter the devtool server host:port (${defaultHost})`;
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