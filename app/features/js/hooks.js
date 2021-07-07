var {After, Before} = require('@cucumber/cucumber');
const PageHelper = require("./page-helper");

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
    this.client = client;
    this.assert = await PageHelper(client);
    callback();
  }) ;
});

After(function (testCase, callback) {
  this.getDriver().then(async (driver) => {
    // const client = await driver.client;
    // await driver.chromeDriver.process.kill()
    // await this.client.shutdown();
    driver.stop();
    callback();
    // await this.client.close();
    console.log("closed")
    callback();
  });
});

