const objectMatcher = require('./object-matcher');
const {getAll} = require('./field-matchers');

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
    const matchers = getAll();
    const matcherObject = objectMatcher.create({definition, matchers});

    return {
      matches: (data) => match(matcherObject, data, false, definition)
    };
  }
}