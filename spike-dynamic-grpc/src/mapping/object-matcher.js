module.exports = {
  create : ({definition, matchers}) => {
    const matcherObject = {};
    for(let key in definition){
      const fieldDefinition = definition[key];
      matcherObject[key] = matchers.find(m => m.appliesTo(fieldDefinition))
    }
    return matcherObject;
  }
}