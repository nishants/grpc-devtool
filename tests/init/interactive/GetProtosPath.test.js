const path = require('path');
const GetHostConfig = require('../../../src/init/interactive/GetProtosPath');

describe("GetProtosPath.js", () => {
  let state ;
  const aValidProtsDir = path.join(__dirname, '../../fixtures/protos');

  const previousConfig = {
    prevInput: "value"
  }

  beforeEach(() => {
    state = GetHostConfig.create(previousConfig);
  })

  test("should need user input", () => {
    const needsInput = state.needsMoreInput();
    expect(needsInput).toBe(true);
  });

  test("should ask user for protos dir", () => {
    const expectedQuestion = `Enter path containing your proto files : `;
    const actualQuestion = state.getNextInputQuestion();
    expect(actualQuestion).toBe(expectedQuestion);
  });

  test("should not need any input after getting input", () => {
    state.addInput(aValidProtsDir);
    expect(state.needsMoreInput()).toBe(false);
  });

  test("should need another input if invalid path entered", () => {
    state.addInput('an/invalid/path');
    expect(state.needsMoreInput()).toBe(true);
  });


  test("should ask again if protos dir is not found", () => {
    const expectedQuestion = `Entered path "an/invalid/path" does not exist. Please enter a valid path : `;

    state.addInput('an/invalid/path');

    const actualQuestion = state.getNextInputQuestion();
    expect(actualQuestion).toBe(expectedQuestion);
  });

  test("should add user input to config as protosPath", () => {
    const expectedConfig = {
      protosPath: aValidProtsDir,
      prevInput: "value"
    };
    state.addInput(aValidProtsDir);
    const actualConfig = state.getConfig();
    expect(actualConfig).toEqual(expectedConfig);
  });
});