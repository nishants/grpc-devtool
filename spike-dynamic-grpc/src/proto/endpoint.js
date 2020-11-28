const message = require("./message");

module.exports = {
  create : (e, protoFile) => {

    const requestType = message.create(e.requestType, e.requestStream );
    const responseType = message.create(e.responseType, e.responseStream );
    const name = e.path.split("/").pop();

    const path = e.path.split("/")[1].split('.');
    const serviceName = path.pop();
    const packageName = path.join(".");

    const endpointId = e.path.replace("/", "").replace("/", ".");

    return {
      getId : () => endpointId,
      getService: () => `${packageName}.${serviceName}`,
      getName : () => name,
      getServiceName : () => serviceName,
      getPackageName : () => packageName,
      getRequest : () => requestType,
      getResponse : () => responseType,
      getLoadedProto: () => protoFile
    }
  }
};