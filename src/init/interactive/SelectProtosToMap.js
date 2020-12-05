

module.exports = {
  create : (prevConfig) => {
    let config = {
      ...prevConfig,
      protosToMap: []
    };

    const protoFiles = config.protoFiles;
    let nextFile = 0;

    return {
      needsMoreInput: () => {
        return config.createDefaultMappings === true && nextFile !== protoFiles.length;
      },
      getNextInputQuestion: () => {
        const file = protoFiles[nextFile];
        return `Generate default mappings for ${file} (y/n) ? (y)`;
      },
      addInput: (input) => {
        const ignore = ['n', 'no'].includes(input.trim().toLowerCase());

        if(ignore){
          return nextFile++;
        }

        config.protosToMap.push(protoFiles[nextFile++]);
      },
      getConfig: () => {
        return config;
      }
    };
  }
};