const config = require('../config');

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
    const matcherObject = {};

    for(let key in definition){
      const fieldDefinition = definition[key];
      matcherObject[key] = matchers.find(m => m.appliesTo(fieldDefinition))
    }

    return {
      matches: (data) => match(matcherObject, data, false, definition)
    };
  }
}