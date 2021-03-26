const {Given, Then, When} = require('@cucumber/cucumber');
const {expect} = require('chai');

Given(/^I open app for the first time$/, async function () {
  this.assert.elementExists(".welcome-screen");
  this.assert.elementExists('[name="load-project"]');
  this.assert.elementExists('[name="load-project"]');

  // const welcomeScreen = await this.client.$(".welcome-screen");
  // const isDisplayed = await welcomeScreen.isExisting();
  // expect(isDisplayed).to.be.true;
  //
  // const loadProjectElement = await this.client.$('[name="load-project"]');
  // const loadProjectElementDisplayed = await welcomeScreen.isExisting();
  //
  // expect(loadProjectElementDisplayed).to.be.true;
  //
  // const createProjectElement = await this.client.$('[name="create-project"]');
  // expect(await createProjectElement.isExisting()).to.be.true;
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
