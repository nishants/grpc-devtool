const {Given, Then, When} = require('@cucumber/cucumber');

Given(/^I open app for the first time$/, function () {
  console.log(this.getTestInfo());
});

Then(/^I should see option to load existing project$/, function () {

});
When(/^I open a project from filesystem$/, function () {

});
Then(/^I see project configuration$/, function () {

});
When(/^I choose start server$/, function () {

});
Then(/^It should serve the configured endpoints$/, function () {

});
