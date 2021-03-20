var {After, Before} = require('@cucumber/cucumber');

Before(function (testCase, callback) {
  const absoluteFeatureFilePath = testCase.pickle.uri;
  const featureName = testCase.gherkinDocument.feature.name;
  const tags = testCase.pickle.name;
  const scenarioName = testCase.pickle.name;
  const stepsAsString = testCase.pickle.steps.map(s => s.text);
  console.log({
    stepsAsString,
    absoluteFeatureFilePath,
    featureName,
    tags,
    scenarioName,
    stepsAsString
  });
  console.log("Starting in 5 seconds...")
  this.count = 0;
  setTimeout( callback, 5000);
});

After(function (testCase, callback) {
  callback();
});

