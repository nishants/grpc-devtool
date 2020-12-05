

module.exports = {
  create : () => {
    let config = {
      outputDir: null
    };

    const defaultOutputDir = './';

    return {
      needsMoreInput: () => {
        return !config.outputDir;
      },
      getNextInputQuestion: () => {
        return `Where do you want to save your configuration ?  : ${defaultOutputDir})`;
      },
      addInput: (outputDir) => {
        config = {
          ...config,
          outputDir: outputDir || defaultOutputDir
        };
      },
      getConfig: () => {
        return config;
      }
    };
  }
};