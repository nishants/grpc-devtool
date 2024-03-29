const fixtures = require('../../fixtures');
const GetHostConfig = require('../../../src/init/interactive/GetProtosPath');

describe('GetProtosPath.js', () => {
  let state ;
  const aValidProtsDir = fixtures.pricesProject.protosPath;
  const aValidDirWithNoProtos = fixtures.pricesProject.configPath;

  const previousConfig = {
    prevInput: 'value'
  }

  beforeEach(async () => {
    state = await GetHostConfig.create(previousConfig);
  })

  test('should need user input', () => {
    const needsInput = state.needsMoreInput();
    expect(needsInput).toBe(true);
  });

  test('should ask user for protos dir', () => {
    const expectedQuestion = {
      question: 'Enter path containing your proto files : '
    };
    const actualQuestion = state.getNextInputQuestion();
    expect(actualQuestion).toEqual(expectedQuestion);
  });

  test('should not need any input after getting input', async () => {
    await state.addInput(aValidProtsDir);
    expect(state.needsMoreInput()).toBe(false);
  });

  test('should need another input if invalid path entered', async () => {
    await state.addInput('an/invalid/path');
    expect(state.needsMoreInput()).toBe(true);
  });


  test('should ask again if protos dir is not found', async () => {
    const expectedQuestion = {
      error: '"an/invalid/path" does not exist.',
      question: 'Enter path containing your proto files : '
    };

    await state.addInput('an/invalid/path');

    const actualQuestion = state.getNextInputQuestion();
    expect(actualQuestion).toEqual(expectedQuestion);
  });

  test('should add user input to config as protosPath', async () => {
    const expectedConfig = {
      prevInput: 'value',
      protoFiles: [
        `${aValidProtsDir}/greet.proto`,
        `${aValidProtsDir}/helloworld.proto`,
        `${aValidProtsDir}/prices.proto`,
      ]
    };
    await state.addInput(aValidProtsDir);
    const actualConfig = state.getConfig();
    expect(actualConfig.protoFiles.sort()).toEqual(expectedConfig.protoFiles.sort());
    expect(actualConfig.prevInput).toEqual(expectedConfig.prevInput);
  });

  test('should warn if no proto files found at path', async () => {
    await state.addInput(aValidDirWithNoProtos);
    expect(state.needsMoreInput()).toBe(true);
  });

  test('should not need user input if protosPath already exists in config', async () => {
    state = await GetHostConfig.create({
      protosPath: aValidProtsDir
    });

    await state.addInput(aValidDirWithNoProtos);
    expect(state.needsMoreInput()).toBe(false);

    const expectedConfig = {
      protoFiles: [
        `${aValidProtsDir}/greet.proto`,
        `${aValidProtsDir}/prices.proto`,
        `${aValidProtsDir}/helloworld.proto`
      ],
      protosPath: aValidProtsDir
    };

    const actualConfig = state.getConfig();

    expect(actualConfig.protoFiles.sort()).toEqual(expectedConfig.protoFiles.sort());
    expect(actualConfig.protosPath).toEqual(expectedConfig.protosPath);
  });

  test('should ignore proto files with no services', async () => {
    state = await GetHostConfig.create({
      protosPath: aValidProtsDir
    });
    const aMessageOnlyProto = `${aValidProtsDir}/subdir/messages.proto`;

    const actualConfig = state.getConfig();
    expect(actualConfig.protoFiles.includes(aMessageOnlyProto)).toBe(false);
  });
});
