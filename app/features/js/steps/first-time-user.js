const {Given, Then, When} = require('@cucumber/cucumber');
const {expect} = require('chai');

Given(/^I open app for the first time$/, async function () {
  const welcomeItem = await this.client.$("#create-new");
  const welcomeItemText = await welcomeItem.getText();
  expect(welcomeItemText).to.equal("Welcome"); // Recommended
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
