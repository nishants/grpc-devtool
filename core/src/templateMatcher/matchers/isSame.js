const {areEqual}  = require('./compare');

const isEqual = {
  name : 'isEqual',
  appliesTo : () => true,
  matches : (spec, data) =>  {
    return spec == data;
  }
};

module.exports = isEqual;