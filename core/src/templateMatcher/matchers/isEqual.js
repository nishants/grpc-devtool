const {areEqual}  = require('./compare');

const isEqual = {
  name : 'isEqual',
  appliesTo : spec => typeof spec === 'object',
  matches : (spec, data) =>  {
    return areEqual(spec, data);
  }
};

module.exports = isEqual;