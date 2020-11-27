// Performs static comparison of values
const isEqual = {
  appliesTo : () => true,
  matches : (data, definition) =>  data === definition
};

module.exports = isEqual;