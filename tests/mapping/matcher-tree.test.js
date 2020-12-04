const MatchingTree = require('../../src/mapping/matcher-tree/matcher-tree');

const getSpecsFromTree = (tree => {
  if(Array.isArray(tree)){
    return tree.map(value => {
      return value.isNode ? value.spec : getSpecsFromTree(value);
    });
  }

  const valueTree = {};
  for(const fieldName in tree){
    const fieldValue = tree[fieldName];
    valueTree[fieldName] = fieldValue.isNode ? fieldValue.spec : getSpecsFromTree(fieldValue)
  }
  return valueTree;
});

describe("matcher-tree.js", () => {

  test("should generate a  tree", () => {
    const spec = {
      value : 21,
      array : [1, 2, 3, {value: "nestedObjeInArray", nestedArray: [{value: "deeplyNestedObjecInArray"}]}],
      object: {
        objectValue: "object value",
        objectValueOther: "object value other",
        nestedObject: {
          nestedObjectValue: "nested object value",
          nestedObjectValueOther: "nested object value other",
          deeplyNestedArray : [1, 2, 3, {value: "nestedObjeInArray", nestedArray: [{value: "deeplyNestedObjecInArray"}]}]
        }
      }
    };

    const matcher = MatchingTree.create(spec);
    const actualSpec = getSpecsFromTree(matcher);

    expect(actualSpec).toEqual(spec);
  })
})