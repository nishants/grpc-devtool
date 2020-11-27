const isAny = require('./isAny');
const isNotNull = require('./isNotNull');
const isEqual = require('./isEqual');

const getAll = () => {
  return [
    isAny,
    isNotNull,
    isEqual
  ];
}

module.exports = {
  getAll
};