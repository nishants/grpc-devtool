const GetHostConfig = require('../../../src/init/interactive/GetHostConfig');

describe("GetHostConfig.js", () => {
  let getHostConfig ;
  const previousConfig = {
    prevInput: "value"
  }

  beforeEach(() => {
    getHostConfig = GetHostConfig.create(previousConfig);
  })

  test("should need user input", () => {
    const needsInput = getHostConfig.needsMoreInput();
    expect(needsInput).toBe(true);
  });

  test("should ask user for host and port", () => {
    const expectedQuestion = `Enter the devtool server host:port (localhost:3009)`;
    const actualQuestion = getHostConfig.getNextInputQuestion();
    expect(actualQuestion).toBe(expectedQuestion);
  });

  test("should not need any input after getting path", () => {
    getHostConfig.addInput('some input');
    expect(getHostConfig.needsMoreInput()).toBe(false);
  });

  test("should add user input to config as hostPort", () => {
    const expectedConfig = {
      hostPort: 'host:port',
      prevInput: "value"
    };
    getHostConfig.addInput('host:port');
    const actualConfig = getHostConfig.getConfig();
    expect(actualConfig).toEqual(expectedConfig);
  });


  test("should set default config if user entered empty", () => {
    const expectedConfig = {
      hostPort: 'localhost:3009',
      prevInput: "value"
    };
    getHostConfig.addInput(' ');
    const actualConfig = getHostConfig.getConfig();
    expect(actualConfig).toEqual(expectedConfig);
  });
});