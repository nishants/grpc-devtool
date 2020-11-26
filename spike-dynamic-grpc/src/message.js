const FIELD_TYPES = {
  TYPE_STRING: "string"
};

const createField = ({name, type}) => {

  return {
    getName : () => name,
    getType : () => FIELD_TYPES[type],
  };
};

module.exports = {
  create : (protoMessage) => {
    const fields = protoMessage.type.field.map(createField);

    return {
      getName : () => protoMessage.type.name,
      getFields : () => fields,
    };
  }
};