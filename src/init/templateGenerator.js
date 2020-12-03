const endOfLine = require('os').EOL;

const typeDefaultValues = {
  TYPE_STRING: 'string'
};

module.exports = {
  create: (endpoint) => {
    const request = {};
    const response = {};

    const requestFields = endpoint.getRequest().getUnderlyingFields();
    const responseFields = endpoint.getResponse().getUnderlyingFields();

    requestFields.forEach(field => {
      request[field.name] = "@any";
    });

    responseFields.forEach(field => {
      response[field.name] = typeDefaultValues[field.type];
    });
    const json = (data) => JSON.stringify(data, null, 2);
    const template =  `request@ : ${json(request)} ${endOfLine + endOfLine}response@ : ${json(response)}`;

    return template;
  }
}