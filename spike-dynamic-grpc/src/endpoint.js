const message = require("./message");

module.exports = {
  create : (e) => {

    const requestType = message.create(e.requestType, e.requestStream );
    const responseType = message.create(e.responseType, e.responseStream );

    return {
      getName : () => e.originalName,
      getRequest : () => requestType,
      getResponse : () => responseType,
    }
  }
};