const {areEqual}  = require('./compare');

// Performs static comparison of values
const isEqual = {
  appliesTo : () => true,
  matches : (data, definition) =>  {
    return {
      failed : !areEqual(data, definition)
    };
  }
};

module.exports = isEqual;