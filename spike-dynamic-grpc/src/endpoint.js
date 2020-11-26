const message = require("./message");

module.exports = {
  create : (e) => {

    const requestType = message.create(e.requestType, e.requestStream );
    const responseType = message.create(e.responseType, e.responseStream );
    ///prices.Pricing/Subscribe

    return {
      getName : () => e.originalName,
      getRequest : () => requestType,
      getResponse : () => responseType,
    }
  }
};