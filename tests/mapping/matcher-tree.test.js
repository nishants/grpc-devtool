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
  });

  test("should ignore unkown fields in data", () => {
    const spec = {
      value : 21,
    };

    const data = {
      value : 21,
      unknownField: {value: true},
      unkownArray: [],
      unknownFlag: true
    };

    const tree = MatchingTree.create(spec);
    const matches = MatchingTree.matches(tree, data);

    expect(matches).toBe(true);
  });

  test("should support any@ specs", () => {
    const spec = {
      value : "any@",
    };

    const data = {
      value : 21,
      unknownField: {value: true},
      unkownArray: [],
      unknownFlag: true
    };

    const tree = MatchingTree.create(spec);
    const matches = MatchingTree.matches(tree, data);

    expect(matches).toBe(true);
  });


  test("should match exact same data tree", () => {
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

    const data = {
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
    }

    const matcherTree = MatchingTree.create(spec);
    const matches = MatchingTree.matches(matcherTree, data);

    expect(matches).toBe(true);
  });

  test("should not match if nested array doesnt match", () => {
    const spec = {
      value : 21,
      array : [1, 2, 3, {value: "nestedObjeInArray", nestedArray: [{value: "deeplyNestedObjecInArray"}]}],
      object: {
        objectValue: "object value",
        objectValueOther: "object value other",
        nestedObject: {
          nestedObjectValue: "nested object value",
          nestedObjectValueOther: "nested object value other",
          deeplyNestedArray : [1, 2, 3, {value: "nestedObjeInArray", nestedArray: [2, {value: "deeplyNestedObjecInArray"}]}]
        }
      }
    };

    const data = {
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
    }

    const matcherTree = MatchingTree.create(spec);
    const matches = MatchingTree.matches(matcherTree, data);

    expect(matches).toBe(false);
  });

  test("should not match if nested object doesnt match", () => {
    const spec = {
      value : 21,
      array : [1, 2, 3, {value: "nestedObjeInArray", nestedArray: [{value: "deeplyNestedObjecInArray", unknown: "yes"}]}],
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

    const data = {
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
    }

    const matcherTree = MatchingTree.create(spec);
    const matches = MatchingTree.matches(matcherTree, data);

    expect(matches).toBe(false);
  });
});