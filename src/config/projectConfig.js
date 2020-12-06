const path = require('path');
const chalk = require('chalk');
const {getFilesFromDir, readYamlFile} = require('../utils/files');
const configFileName = 'grpc.yaml'

const withConfig = (config) => {
  return {
    ...config,
    protosPath: path.resolve(config.protos),
    configPath: path.resolve(config.configPath),
    streamingLoopSize: isNaN(config.streamingLoopSize) ? 10 : config.streamingLoopSize
  };
}

module.exports = {

  read: async (cliParams, dir)=> {
    const pathToSearchForConfig = path.resolve(dir, cliParams.configPath ? `${cliParams.configPath}/**/${configFileName}` :` ${dir}/**/${configFileName}`);

    const configFiles = await getFilesFromDir(pathToSearchForConfig) ;
    const configFile = configFiles[0];

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


    return withConfig({
      ...projectConfig,
      ...cliParams
    });
  },
}