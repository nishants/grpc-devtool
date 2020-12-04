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
  }
};

module.exports = MatcherTree