const matchers = require('./matchers');

const MatcherNode = {
  create: (spec) => {
    const matcher = matchers.getAll().find(m => m.appliesTo(spec));
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