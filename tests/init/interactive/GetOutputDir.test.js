const GetOutputDir = require('../../../src/init/interactive/GetOutputDir');

describe("GetOutputDir.js", () => {
  let getOutputDir ;

  beforeEach(() => {
    getOutputDir = GetOutputDir.create();
  })

  test("should get output dir from user", () => {
    const needsInput = getOutputDir.needsMoreInput();
    expect(needsInput).toBe(true);
  });

  test("should ask user for input dir", () => {
    const expectedQuestion = `Where do you want to save your configuration ?  : ${process.cwd()})`;
    const actualQuestion = getOutputDir.getNextInputQuestion();
    expect(actualQuestion).toBe(expectedQuestion);
  });

  test("should not need any input after getting path", () => {
    getOutputDir.addInput('some input');
    expect(getOutputDir.needsMoreInput()).toBe(false);
  });

  test("should add user input to config as outputDir", () => {
    const expectedConfig = {
      outputDir: 'user/entered/path'
    };
    getOutputDir.addInput('user/entered/path');
    const actualConfig = getOutputDir.getConfig();
    expect(actualConfig).toEqual(expectedConfig);
  });
});