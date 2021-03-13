const allElementsAreUnique = (values, suffixLength) => {
  const common = values[0][suffixLength];

  for(const value of values.slice(1)){
    if(value[suffixLength] === common){
      return false;
    }
  }

  return true;
};

module.exports = (array) => {
  if(array.length === 0){
    return [];
  }

  const values = array.map(v => v.split(".").reverse());

  let length = 0;
  while(allElementsAreUnique(values, length)){
    length++;
  }
  return array.map(v => v.split(".").slice(-length).join("."));
}