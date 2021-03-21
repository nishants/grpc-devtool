var {After, Before} = require('@cucumber/cucumber');

Before(function (testCase, callback) {
  const absoluteFeatureFilePath = testCase.pickle.uri;
  const featureName = testCase.gherkinDocument.feature.name;
  const tags = testCase.pickle.name;
  const scenarioName = testCase.pickle.name;
  const stepsAsString = testCase.pickle.steps.map(s => s.text);

  this.setTestInfo({
    stepsAsString,
    absoluteFeatureFilePath,
    featureName,
    tags,
    scenarioName,
    stepsAsString
  });

  this.getDriver().then(async (driver) => {
    const client = await driver.client;
    const win = await client.windowByIndex(0);
    const count = await client.getWindowCount();
    const windowHandler = await client.getWindowHandle();
    this.$ = client.$;
    this.client = client;
    callback();
  }) ;
});

After(function (testCase, callback) {
  this.getDriver().then(async (driver) => {
    const client = await driver.client;
    await this.client.shutdown();
    callback();
  });
});

