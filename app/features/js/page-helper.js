const {expect} = require('chai');

module.exports = async (client) => {

  return {
    elementExists: async (selector) => {
      const element = await client.$(selector);
      const isDisplayed = await element.isExisting();
      expect(isDisplayed).to.be.true;
    },

    shouldHaveText: async (selector, expectedText) => {
      const element = await client.$(selector);
      const text = await element.getText();
      expect(text).to.equal(expectedText);
    }
  }
};
