const fs = require('fs');
const path = require('path');

const init = require('../src/init/init');
const {createTempDir, readYamlFile} = require('../src/utils/files');

describe('init project', () => {
  const protosPath = path.join(__dirname, './fixtures/protos');
  let protosToMap;
  let outputDir;
  let expectedMappingFile;

  beforeAll(async () => {
    protosToMap = [
      'helloworld.proto',
      'subdir/messages.proto',
      'prices.proto',
    ].map(name => path.join(__dirname, 'fixtures', 'protos', name));
  });

  beforeEach(async () => {
    outputDir = await createTempDir('mirage-config-test');
    expectedMappingFile = path.join(outputDir, 'mappings.yaml');
    await init.create({outputDir, protosToMap, protosPath});
  });

  test('should create config.yaml file with default values', async () => {
    const expected = {
      host: 'localhost',
      port: '3009',
      streamingLoopSize: 10,
      protos: './protos'
    };

    const actual = await readYamlFile(path.join(outputDir, 'grpc.yaml'));

    expect(actual).toEqual(expected);
  });

  describe("copy protofiles", () => {

    test('should copy protos to output dir', async () => {
      const expectedFilesToCopy = [
        'helloworld.proto',
        'prices.proto',
      ];

      for(const protoFile of expectedFilesToCopy){
        const copiedProtoFile = path.join(outputDir, 'protos', protoFile);
        const exists = fs.existsSync(copiedProtoFile);

        expect({copiedProtoFile, exists}).toEqual({copiedProtoFile, exists: true});
      }
    });

    test('should copy protos not selected for mapping', async () => {
      const expectedFilesToCopy = [
        'greet.proto',
        'subdir/messages.proto'
      ];

      for(const protoFile of expectedFilesToCopy){
        const copiedProtoFile = path.join(outputDir, 'protos', protoFile);
        const exists = fs.existsSync(copiedProtoFile);

        expect({copiedProtoFile, exists}).toEqual({copiedProtoFile, exists: true});
      }
    });
  })

  test('should create mappings file', async () => {
    expect(fs.existsSync(expectedMappingFile)).toBe(true);
  });

  test('should add all endpoints in mappings file ', async () => {
    const expectedMappings = [
      'helloworld.greet.Greeter.SayHello',
      'helloworld.greet.Greeter.StaySilent',
      'helloworld.greet.UnimplementedService.Unimplemented',
      'helloworld.greet.UnimplementedService.Unimplemented2',
      'prices.streaming.Pricing.Subscribe',
      "prices.streaming.Pricing.MultiSubscribe",
      'prices.streaming.Pricing.TwoWaySubscribe'
    ];

    const mappings = await readYamlFile(expectedMappingFile);

    const endpointsMapped = Object.keys(mappings);


    expect(endpointsMapped).toEqual(expectedMappings);
  });

  test('should map all endpoints to a default.yaml', async () => {
    const expectedMappings = {
      'helloworld.greet.Greeter.SayHello': [
        'data/SayHello/default.yaml'
      ],
      'helloworld.greet.Greeter.StaySilent': [
        'data/StaySilent/default.yaml'
      ],
      'helloworld.greet.UnimplementedService.Unimplemented': [
        'data/Unimplemented/default.yaml'
      ],
      'helloworld.greet.UnimplementedService.Unimplemented2': [
        'data/Unimplemented2/default.yaml'
      ],
      'prices.streaming.Pricing.MultiSubscribe': [
        'data/MultiSubscribe/default.yaml'
      ],
      'prices.streaming.Pricing.Subscribe': [
        'data/Subscribe/default.yaml'
      ],
      'prices.streaming.Pricing.TwoWaySubscribe': [
        'data/TwoWaySubscribe/default.yaml'
      ]
    };

    const mappings = await readYamlFile(expectedMappingFile);

    expect(mappings).toEqual(expectedMappings);
  });

  test('should create default.yaml for all endpoints with unique suffixes', async () => {

    const expectedFilesToCreated = [
      'SayHello',
      'StaySilent',
      'Unimplemented',
      'Unimplemented2',
      'Subscribe',
      "MultiSubscribe",
      'TwoWaySubscribe'
    ];

    for(const endpointId of expectedFilesToCreated){
      const templateFile = path.join(outputDir, 'data', endpointId, 'default.yaml');
      const exists = fs.existsSync(templateFile);

      expect({templateFile, exists}).toEqual({templateFile, exists: true});
    }
  });

  test('should generate request and response in default templates', async () => {
    const anEndpointId = 'Unimplemented';
    const generatedTemplateFile =  path.join(outputDir, 'data', anEndpointId, 'default.yaml');

    const expectedContent = {
      'request@': {
        'name': '@any'
      },
      'response@': {
        'bytes': 'YWJjMTIzIT8kKiYoKSctPUB+',
        'double': '2.3',
        'fixed32': '43',
        'fixed64': '-10',
        'float': '3.3',
        'int32': '7',
        'int64': '7',
        'sfixed32': '23',
        'sfixed64': '32',
        'sint32': '12',
        'sint64': 'str23ing',
        'string': 'string',
        'uint32': '7',
        'uint64': '7'
      }
    };

    const actualContent = await readYamlFile(generatedTemplateFile);

    expect(actualContent).toEqual(expectedContent);
  });

  test('should add streaming response in default template', async () => {
    const aStreamingEndpointId = 'Subscribe';
    const generatedTemplateFile =  path.join(outputDir, 'data', aStreamingEndpointId, 'default.yaml');

    const expectedContent = {
      'request@': {
        assetType: '@any',
        uic: '@any'
      },
      'response@': {
        'stream@': [{quote: 'string'}],
        'streamInterval@': 1000
      }
    };

    const actualContent = await readYamlFile(generatedTemplateFile);

    expect(actualContent).toEqual(expectedContent);
  });

  test('should correctly copy protos keeping relative path to protosPath', async () => {
    const nestedProtosPath = path.join(__dirname, './fixtures');
    const protoFile = path.join(__dirname, 'fixtures', 'protos', 'prices.proto')

    outputDir = await createTempDir('mirage-config-test');

    await init.create({
      outputDir,
      protosToMap : [protoFile],
      protosPath: nestedProtosPath
    });

    const expectedCopiedProtoPath = path.join(outputDir, 'protos', 'protos', 'prices.proto');
    const exists = fs.existsSync(expectedCopiedProtoPath);

    expect({copiedProtoFile: expectedCopiedProtoPath, exists}).toEqual({copiedProtoFile: expectedCopiedProtoPath, exists: true});
  });

});
