module.exports = {
  create : ({name, request, response}) => {

    return {
      getName : () => name,
      getRequest : () => request,
      getResponse : () => response,
    }
  }
};