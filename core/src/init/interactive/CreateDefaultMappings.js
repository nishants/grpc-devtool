

module.exports = {
  create : (prevConfig) => {
    let config = {
      ...prevConfig,
      createDefaultMappings: undefined
    };

    return {
      needsMoreInput: () => {
        return typeof config.createDefaultMappings === 'undefined';
      },
      getNextInputQuestion: () => {
        return {
          question : 'Do you want to create default mappings (y/n)',
          default  : 'y',
          hint     : null
        };
      },
      addInput: (input) => {
        config = {
          ...config,
          createDefaultMappings: !['n', 'no'].includes(input.trim().toLowerCase())
        };
      },
      getConfig: () => {
        return config;
      }
    };
  }
};