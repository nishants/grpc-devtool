const message = require("./message");

module.exports = {
  create : (e) => {

    const requestType = message.create(e.requestType, e.requestStream );
    const responseType = message.create(e.responseType, e.responseStream );
    const name = e.path.split("/").pop();
    ///prices.Pricing/Subscribe

    return {
      getName : () => name,
      getRequest : () => requestType,
      getResponse : () => responseType,
    }
  }
};