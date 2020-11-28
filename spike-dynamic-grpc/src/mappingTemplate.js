
module.exports = {
  create: (data) => {
    return {
      getRequest: () => {
        return data['request@']
      }
    };
  }
}