const message = require("./message");

module.exports = {
  create : (e) => {

    const requestType = message.create(e.requestType, e.requestStream );
    const responseType = message.create(e.responseType, e.responseStream );
    const name = e.path.split("/").pop();

    const path = e.path.split("/")[1].split('.');
    const serviceName = path.pop();
    const packageName = path.join(".");
    ///prices.Pricing/Subscribe

    return {
      getName : () => name,
      getServiceName : () => serviceName,
      getPackageName : () => packageName,
      getRequest : () => requestType,
      getResponse : () => responseType,
    }
  }
};