// Performs static comparison of values
const isEqual = {
  appliesTo : () => true,
  matches : (data, definition) =>  {
    return {
      // TODO make this deep equal comparison
      failed : data !== definition
    };
  }
};

module.exports = isEqual;