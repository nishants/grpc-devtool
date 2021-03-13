const isAny = require('./isAny');
const isNotNull = require('./isNotNull');
const isEqual = require('./isEqual');
const isSame = require('./isSame');

const getAll = () => {
  return [
    isAny,
    isNotNull,
    isEqual,
    isSame
  ];
}

module.exports = {
  getAll
};