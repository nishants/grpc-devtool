const reduce = ({matcher, data}) => {
  let matchers = [{matcher, data}];
  while(matchers.length){
    const next = matchers.pop();
    const result = next.matcher.matches(next.data, next.definition);
    if(result.failed){
      return false;
    }
    matchers = [...matchers,...(result.nextMatchers || [])];
  }
  return true;
};
module.exports = {
  reduce
};