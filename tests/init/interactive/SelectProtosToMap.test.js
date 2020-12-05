const SelectProtosToMap = require('../../../src/init/interactive/SelectProtosToMap');

describe("SelectProtosToMap.js", () => {
  let state ;

  const previousConfig = {
    createDefaultMappings: true,
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

  test("should not need user input user does not want to create default mappings", () => {
    const needsInput = SelectProtosToMap.create({
      createDefaultMappings: false,
      protoFiles: ['file-1', 'file-2', 'file-3']
    }).needsMoreInput();

    expect(needsInput).toBe(false);
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
      createDefaultMappings: true,
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