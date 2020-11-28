const ObjectMatcher = require('./object-matcher');
const {getAll} = require('./field-matchers');
const {reduce} = require('./reducer');

module.exports = {
  create :({definition}) => {
    const matchers = getAll();
    const objectMatcher = ObjectMatcher.create({definition, matchers});

    return {
      matches: (data) => {
        return reduce ({matcher: objectMatcher, data: data});
      }
    };
  }
}