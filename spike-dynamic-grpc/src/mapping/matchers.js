const deepEqual = require('./deepEqual');

const isStatic = (definition) => {
  return true;
};

const matchers = [
  {appliesTo : isStatic, match : deepEqual.areEqual }
];

module.exports = {
  create :({definition, script}) => {
    const matcher = matchers.find(m => m.appliesTo(definition));

    return {
      match: (data) => matcher.match(definition, data)
    };
  }
}