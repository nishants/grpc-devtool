const {getAll} = require('../field-matchers');

const MatcherNode = {
  create: (spec) => {
    const matcher = getAll().find(m => m.appliesTo(spec));
    return {
      spec,
      isNode: true,
      matches: (data) => {
        return matcher.matches(spec, data);
      }
    };
  }
};

module.exports = MatcherNode