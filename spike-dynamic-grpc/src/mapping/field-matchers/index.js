const isAny = require('./isAny');
const isEqual = require('./isEqual');

const getAll = () => {
  return [
    isAny,
    isEqual
  ];
}

module.exports = {
  getAll
};