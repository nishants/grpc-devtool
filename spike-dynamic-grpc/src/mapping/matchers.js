const config = require('../config');
const objectMatcher = require('./object-matcher');

// Always returns true
const isAny = {
  appliesTo : (definitionField) => {
    return config.isKeyWord(definitionField, 'any')
  },
  matches : () => true
};

// Performs static comparison of values
const isEqual = {
  appliesTo : () => true,
  matches : (data, definition) =>  data === definition
};

const matchers = [
  isAny,
  isEqual
];
const match = (matcherObject, data, ignoreOther, definition) => {
  // Check if missing fields
  // if(!ignoreOther && Object.keys(definition).length !== Object.keys(data).length){
  //   return false;
  // }

  for(let key in matcherObject){
    const fieldMatcher = matcherObject[key];
    if(!fieldMatcher.matches(data[key], definition[key])){
      return false;
    }
  }
  return true;
};

module.exports = {
  create :({definition, script}) => {
    const matcherObject = objectMatcher.create({definition, matchers});

    return {
      matches: (data) => match(matcherObject, data, false, definition)
    };
  }
}