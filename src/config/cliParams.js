const {getFilesFromDir} = require('../utils/files');

module.exports = {
  parse: (params)=> {
    return {
      host: 'localhost',
      port: 3202,
      configPath : 'path/to/config with space',
      protosPath: 'path/to/protos',
      remoteHost: 'remote.host',
      remotePort: 'remote.port',
      streamingLoopSize: 1212
    }
  },
}