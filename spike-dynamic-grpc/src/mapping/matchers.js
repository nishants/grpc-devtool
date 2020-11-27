const ObjectMatcher = require('./object-matcher');
const {getAll} = require('./field-matchers');

module.exports = {
  create :({definition, script}) => {
    const matchers = getAll();
    const objectMatcher = ObjectMatcher.create({definition, matchers});

    return objectMatcher;
  }
}