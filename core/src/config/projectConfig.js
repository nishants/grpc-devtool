const path = require('path');
const chalk = require('chalk');
const {getFilesFromDir, readYamlFile} = require('../utils/files');
const configFileName = 'grpc.yaml'

const withConfig = (config) => {
  return {
    ...config,
    protosPath: path.resolve(config.protos),
    configPath: path.resolve(config.configPath),
    trimmedStreamSize: isNaN(config.trimmedStreamSize) ? 10 : config.trimmedStreamSize
  };
}

module.exports = {

  read: async (cliParams, dir)=> {
    const pathToSearchForConfig = path.resolve(dir, cliParams.configPath ? `${cliParams.configPath}/**/${configFileName}` :` ${dir}/**/${configFileName}`);

    const configFiles = await getFilesFromDir(pathToSearchForConfig) ;
    const configFile = configFiles[0];
    const configPath = path.dirname(configFile);

    if(configFiles.length > 1){
      console.warn("Multiple configuration files found", configFiles);
      console.warn("Continuing with ", configFile);
    }

    let projectConfig = {};

    if(!configFile){
      console.warn(chalk.red(`${configFileName} not found in any subdirectories of ${pathToSearchForConfig}`));
    } else{
      projectConfig = await readYamlFile(configFile);
    }

    // Ignore config path form user input and set to dir containing grpc.yaml
    return withConfig({
      ...projectConfig,
      ...cliParams,
      configPath
    });
  },
}