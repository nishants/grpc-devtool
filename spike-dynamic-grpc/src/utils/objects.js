
module.exports = {
  getPathFromObject : ({object, path}) => {
    const pathItems = path.split(".");
    let value = object;
    for(let i = 0; i < pathItems.length; i++){
      value = value[pathItems[i]];
    }
    return value;
  }
}