const cliParams = require('../../src/config/cliParams');

describe('getConfigPath.js', () => {

  const pathToFixtures = cliParams.parse('');

  test('should get output dir from user', () => {
    const cliInput = "";
    const expected = {
        host: 'localhost',
        port: 3202,
        configPath : 'path/to/config with space',
        protosPath: 'path/to/protos',
        remoteHost: 'remote.host',
        remotePort: 'remote.port',
        streamingLoopSize: 1212
      }
    ;
    const actual = cliParams.parse(cliInput)

    expect(actual).toEqual(expected);
  });

});