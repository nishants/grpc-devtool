const config = require('../../config');

const isNotNull = {
  name: 'isNotNull',
  appliesTo : (definitionField) => {
    return config.isKeyWord(definitionField, 'any!')
  },
  matches : (spec, data) => {
    return !!data;
  }
};

module.exports = isNotNull;