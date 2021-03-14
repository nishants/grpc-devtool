module.exports = {
  "scriptPreprocessor": "<rootDir>/../node_modules/babel-jest",
  testRegex: 'spec\.js$',
  setupFiles: ['./setupTests.js'],
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "collectCoverageFrom": ["src/**/*.js", "!src/index.js"],
  "coverageReporters": ["text"]
};