const isObject = (object) =>
  object != null && typeof object === 'object';

const ObjectMatcher = {
  create : ({definition, matchers}) => {
    const matcherObject = {};
    for(let key in definition){
      const fieldDefinition = definition[key];
      matcherObject[key] = isObject(fieldDefinition) ?
        ObjectMatcher.create({definition: fieldDefinition, matchers})
        :  matchers.find(m => m.appliesTo(fieldDefinition))
    }

    const matches = (data) => {
      const nextMatchers = [];
      for(let key in matcherObject){
        const fieldMatcher = matcherObject[key];
        const fieldData = data[key];
        nextMatchers.push({matcher:fieldMatcher , data: fieldData, definition: definition[key]})
      }
      return {failed: false, nextMatchers};
    };

    return { matches};
  }
};
module.exports = ObjectMatcher