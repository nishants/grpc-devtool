const SelectProtosToMap = require('../../../src/init/interactive/SelectProtosToMap');

describe("SelectProtosToMap.js", () => {
  let state ;

  const previousConfig = {
    prevInput: "value",
    protoFiles: ['file-1', 'file-2', 'file-3']
  }

  beforeEach(() => {
    state = SelectProtosToMap.create(previousConfig);
  })

  test("should need user input", () => {
    const needsInput = state.needsMoreInput();
    expect(needsInput).toBe(true);
  });

  test("should ask user for each proto file", () => {
    const expectedQuestions = [
      'Generate default mappings for file-1 (y/n) ? (y)',
      'Generate default mappings for file-2 (y/n) ? (y)',
      'Generate default mappings for file-3 (y/n) ? (y)'
    ];
    const actualQuestions = [];
    while(state.needsMoreInput()) {
      actualQuestions.push(state.getNextInputQuestion());
      state.addInput('');
    }
    expect(actualQuestions).toEqual(expectedQuestions);
  });

  test("should ignore files if user enter n or no", async () => {
    const expectedConfig = {
      prevInput: "value",
      protoFiles: ['file-1', 'file-2', 'file-3'],
      protosToMap : ['file-2']
    };
    state.addInput('n');
    state.addInput('y');
    state.addInput('no');

    const actualConfig = state.getConfig();
    expect(actualConfig).toEqual(expectedConfig);
  });
});