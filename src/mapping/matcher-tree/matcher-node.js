const {areEqual} = require('../field-matchers/compare');

const MatcherNode = {
  create: (spec) => {
    return {
      spec,
      isNode: true,
      matches: (data) => {
        return areEqual(spec, data);
      }
    };
  }
};

module.exports = MatcherNode