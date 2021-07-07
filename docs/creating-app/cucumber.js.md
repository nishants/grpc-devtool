

Commands 

```
Specify a glob pattern
$ cucumber-js features/**/*.feature
Specify a feature directory
$ cucumber-js features/dir
Specify a feature file
$ cucumber-js features/my_feature.feature
Specify a scenario by its line number
$ cucumber-js features/my_feature.feature:3
Specify a scenario by its name matching a regular expression
$ cucumber-js --name "topic 1"
$ cucumber-js --name "^start.+end$"
```



```
If the features live in a features directory (at any level)
features/**/*.js
Otherwise
<DIR>/**/*.js for each directory containing the selected features
Alternatively, you can use --require <GLOB|DIR|FILE> 
```



Hooks

```javascript
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

```

