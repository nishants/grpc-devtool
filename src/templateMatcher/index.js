const MatcherTree = require('./matcher-tree');

module.exports = {
  create :({definition}) => {
    const tree = MatcherTree.create(definition);

    return {
      matches: (data) => {
        return MatcherTree.matches(tree, data);
      }
    };
  }
}