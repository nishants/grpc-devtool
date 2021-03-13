const config = require('../../config');

// Always returns true
const isAny = {
  name : 'any',
  appliesTo : (definitionField) => {
    return config.isKeyWord(definitionField, 'any')
  },
  matches : () => {
    return true;
  }
};

module.exports = isAny;