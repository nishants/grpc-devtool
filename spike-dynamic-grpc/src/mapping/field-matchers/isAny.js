const config = require('../../config');

// Always returns true
const isAny = {
  appliesTo : (definitionField) => {
    return config.isKeyWord(definitionField, 'any')
  },
  matches : () => true
};

module.exports = isAny;