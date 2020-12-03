const fs = require('fs');
const path = require('path');

const init = require('../src/init/init');
const {createTempDir, readYamlFile} = require('../src/utils/files');

describe('init project', () => {
  const protosPath = path.join(__dirname, './fixtures/protos');
  let outputDir;
  let expectedMappingFile;

  beforeEach(async () => {
    outputDir = await createTempDir('mirage-config-test');
    expectedMappingFile = path.join(outputDir, 'config', 'mappings.yaml');
    await init.create({outputDir, protosPath});
  });

  test('should create mappings file', async () => {
    expect(fs.existsSync(expectedMappingFile)).toBe(true);
  });

  test('should add all endpoints in mappings file ', async () => {
    const expectedMappings = [
      'greet.Greeter.SayHello',
      'helloworld.greet.Greeter.SayHello',
      'helloworld.greet.Greeter.StaySilent',
      'helloworld.greet.UnimplementedService.Unimplemented',
      'helloworld.greet.UnimplementedService.Unimplemented2',
      'prices.streaming.Pricing.Subscribe',
      'prices.streaming.Pricing.TwoWaySubscribe'
    ];

    const mappings = await readYamlFile(expectedMappingFile);

    const endpointsMapped = Object.keys(mappings);


    expect(endpointsMapped).toEqual(expectedMappings);
  });
});
