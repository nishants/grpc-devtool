module.exports = {
  create : ({definition, matchers}) => {
    const matcherObject = {};
    for(let key in definition){
      const fieldDefinition = definition[key];
      matcherObject[key] = matchers.find(m => m.appliesTo(fieldDefinition))
    }

    const matches = (data) => {
      for(let key in matcherObject){
        const fieldMatcher = matcherObject[key];
        if(!fieldMatcher.matches(data[key], definition[key])){
          return false;
        }
      }
      return true;
    };

    return { matches};
  }
}