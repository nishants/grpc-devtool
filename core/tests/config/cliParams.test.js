const cliParams = require('../../src/config/cliParams');

describe('getConfigPath.js', () => {

  test('should get output dir from user', () => {
    const cliInput = [
      'path/to/config with space',
      'port=3202',
      'protos="path/to/protos with space"',
      'remote=remote.host:121',
      'trimmedStreamSize=1212',
      'host=localhost'
    ]

    const expected = {
        host: 'localhost',
        port: 3202,
        configPath : 'path/to/config with space',
        protosPath: 'path/to/protos with space',
        remoteHost: 'remote.host',
        remotePort: 121,
        trimmedStreamSize: 1212
      };

    const actual = cliParams.parse(cliInput)

    expect(actual).toEqual(expected);
  });

  test('should accept empty array', () => {
    const cliInput = []

    const expected = {};

    const actual = cliParams.parse(cliInput)

    expect(actual).toEqual(expected);
  });


  test('should accept only config path', () => {
    const cliInput = ['"path/to/config with space"']

    const expected = {
      configPath: "path/to/config with space"
    };

    const actual = cliParams.parse(cliInput)

    expect(actual).toEqual(expected);
  });


  test('should accept path without quotes', () => {
    const cliInput = ['path/to/config'];

    const expected = {
      configPath: "path/to/config"
    };

    const actual = cliParams.parse(cliInput)

    expect(actual).toEqual(expected);
  });

  test('should accept init params', () => {
    const cliInput = ['out=path/to/output'];

    const expected = {
      outputDir: "path/to/output"
    };

    const actual = cliParams.parse(cliInput)

    expect(actual).toEqual(expected);
  });


});