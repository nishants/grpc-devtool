

module.exports = {
  create : () => {
    let config = {
      outputDir: null
    };

    const defaultOutputDir = process.cwd();

    return {
      needsMoreInput: () => {
        return !config.outputDir;
      },
      getNextInputQuestion: () => {
        return {
          question : 'Where do you want to save your configuration ?',
          default  : defaultOutputDir
        };
      },
      addInput: (outputDir) => {
        config = {
          ...config,
          outputDir: outputDir.trim() || defaultOutputDir
        };
      },
      getConfig: () => {
        return config;
      }
    };
  }
};