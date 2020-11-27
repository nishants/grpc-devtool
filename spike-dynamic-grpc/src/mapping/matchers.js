const objectMatcher = require('./object-matcher');
const {getAll} = require('./field-matchers');

module.exports = {
  create :({definition, script}) => {
    const matchers = getAll();
    const matcherObject = objectMatcher.create({definition, matchers});

    return matcherObject;
  }
}