const MatcherTree = require('./matcher-tree');

module.exports = {
  create :({definition}) => {
    const tree = MatcherTree.create(definition);

    return {
      matches: (data) => {
        return MatcherTree.matches(tree, data);
      },
    };
  },
  anyOf: (matcherList) => {
    return {
      matches: (data) => {
        return false;
        // const matching = matcherList.find(m => m.matches(data));
        // return matching !== null;
      }
    };
  }
}
