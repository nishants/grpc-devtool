const message = require("./message");

module.exports = {
  create : ({name, request, response}) => {

    const requestType = message.create(request);
    const responseType = message.create(response);

    return {
      getName : () => name,
      getRequest : () => requestType,
      getResponse : () => responseType,
    }
  }
};