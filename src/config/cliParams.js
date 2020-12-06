module.exports = {
  parse: (tokens)=> {
    const trim = value => value.trim().replace(/^"/, '').replace(/"$/, '').trim();

    const configPath   = tokens.find(p => !p.includes("="));

    const cliInputs = tokens.filter(str => str.includes("=")).map(token => {
      const assigned = token.split("=").map(s => s.trim());
      return {key : assigned[0], value : assigned[1]};
    }).reduce((config, {key, value}) => {
      return {
        ...config,
        [key]: trim(value.replace('^\"', '').replace(/^\"/, '').replace(/\"$/, ''))
      };
    }, {});

    const config = {};

    if(typeof cliInputs.port !== 'undefined'){
      config.port = parseInt(cliInputs.port);
    }

    if(typeof cliInputs.remotePort !== 'undefined'){
      config.remotePort = parseInt(cliInputs.remotePort);
    }

    if(typeof cliInputs.streamingLoopSize !== 'undefined'){
      config.streamingLoopSize = parseInt(cliInputs.streamingLoopSize);
    }

    if(typeof cliInputs.remote !== 'undefined'){
      const remoteTokens = cliInputs.remote.split(":");
      config.remoteHost = remoteTokens[0];
      config.remotePort = parseInt(remoteTokens[1]);
    }

    if(typeof cliInputs.protos !== 'undefined'){
      config.protosPath = parseInt(cliInputs.protos);
    }

    if(typeof cliInputs.host !== 'undefined'){
      config.host = cliInputs.host;
    }

    if(configPath && trim(configPath)){
      config.configPath = trim(configPath);
    }

    if(cliInputs.protos){
      config.protosPath = trim(cliInputs.protos);
    }

    return config;
  },
}