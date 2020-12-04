const config = require('../../config');

// Always returns true
const isNotNull = {
  name: 'isNotNull',
  appliesTo : (definitionField) => {
    return config.isKeyWord(definitionField, 'any!')
  },
  matches : (data) => {
    return {
      failed : !data
    };
  }
};

module.exports = isNotNull;