const endOfLine = require('os').EOL;

const typeDefaultValues = {
  TYPE_STRING: 'string',
  TYPE_DOUBLE: '2.3',
  TYPE_FLOAT: '3.3',
  TYPE_INT32: '7',
  TYPE_INT64: '7',
  TYPE_UINT32: '7',
  TYPE_UINT64: '7',
  TYPE_SINT32: '12',
  TYPE_SINT64: 'str23ing',
  TYPE_FIXED32: '43',
  TYPE_BYTES: 'YWJjMTIzIT8kKiYoKSctPUB+',
  TYPE_FIXED64: '-10',
  TYPE_SFIXED32: '23',
  TYPE_SFIXED64: '32',
};

module.exports = {
  create: (endpoint) => {
    const requestFields = endpoint.getRequest().getUnderlyingFields();
    const responseFields = endpoint.getResponse().getUnderlyingFields();

    const request = {};
    const responseFieldValues = {};

    requestFields.forEach(field => {
      request[field.name] = "@any";
    });

    responseFields.forEach(field => {
      responseFieldValues[field.name] = typeDefaultValues[field.type];
    });

    const response = endpoint.isStreamingResponse() ? {
      'stream@' : [responseFieldValues],
      "streamInterval@"  : 1000
    } : responseFieldValues;

    const json = (data) => JSON.stringify(data, null, 2);
    const template =  `request@ : ${json(request)} ${endOfLine + endOfLine}response@ : ${json(response)}`;

    return template;
  }
}