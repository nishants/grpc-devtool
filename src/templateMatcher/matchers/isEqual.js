const {areEqual}  = require('./compare');

const isEqual = {
  name : 'isEqual',
  appliesTo : () => true,
  matches : (spec, data) =>  {
    return areEqual(spec, data);
  }
};

module.exports = isEqual;