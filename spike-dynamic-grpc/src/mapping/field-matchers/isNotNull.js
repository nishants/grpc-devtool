const config = require('../../config');

// Always returns true
const isNotNull = {
  appliesTo : (definitionField) => {
    return config.isKeyWord(definitionField, 'any!')
  },
  matches : (data) => data !== null
};

module.exports = isNotNull;