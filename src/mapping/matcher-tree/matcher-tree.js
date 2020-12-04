const MatcherNode = require('./matcher-node');

const isObject = (object) =>
  object != null && typeof object === 'object';

const MatcherTree = {
  create: (root) => {
    if(Array.isArray(root)){
      return root.map(node => isObject(node) ? MatcherTree.create(node) : MatcherNode.create(node));
    }

    const tree = {};
    for(const fieldName in root){
      const fieldValue = root[fieldName];
      tree[fieldName] = isObject(fieldValue) ? MatcherTree.create(fieldValue) : MatcherNode.create(fieldValue);
    }
    return tree;
  },
  matches: (matcherTree, dataTree) => {
    for(const fieldName in matcherTree){
      const data = dataTree[fieldName];
      const matcher = matcherTree[fieldName];
      if(matcher && !data){
        return false;
      }
      if(matcher.isNode){
        if(!matcher.matches(data)){
          return false;
        }
      } else{
        if(!MatcherTree.matches(matcher, data)){
          return false;
        }
      }
    }

    return true;
  }
};

module.exports = MatcherTree