
module.exports = {
  get : ({definition, endpoint}) => {
    const path = endpoint.getService().split(".");
    let value = definition;
    for(let i = 0; i < path.length; i++){
      value = value[path[i]];
    }
    return value;
  }
}