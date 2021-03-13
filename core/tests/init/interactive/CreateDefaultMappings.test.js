const GetHostConfig = require('../../../src/init/interactive/CreateDefaultMappings');

describe('CreateDefaultMappings.js', () => {
  let state ;
  const previousConfig = {
    prevInput: 'value'
  }

  beforeEach(() => {
    state = GetHostConfig.create(previousConfig);
  })

  test('should need user input', () => {
    const needsInput = state.needsMoreInput();
    expect(needsInput).toBe(true);
  });

  test('should ask user if they want to create default mappings', () => {
    const expectedQuestion = {
      default: 'y',
      hint: null,
      question: 'Do you want to create default mappings (y/n)'
    };
    const actualQuestion = state.getNextInputQuestion();
    expect(actualQuestion).toEqual(expectedQuestion);
  });

  test('should not need any input after getting first input', () => {
    state.addInput('');
    expect(state.needsMoreInput()).toBe(false);
  });

  test('should set createDefaultMappings to false if user enters "n"', () => {
    const expectedConfig = {
      prevInput: 'value',
      createDefaultMappings: false
    };
    state.addInput('n');
    const actualConfig = state.getConfig();
    expect(actualConfig).toEqual(expectedConfig);
  });


  test('should set createDefaultMappings to true by default', () => {
    const expectedConfig = {
      prevInput: 'value',
      createDefaultMappings: true
    };
    state.addInput(' ');
    const actualConfig = state.getConfig();
    expect(actualConfig).toEqual(expectedConfig);
  });
});