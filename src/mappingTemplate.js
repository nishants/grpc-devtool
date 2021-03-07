const jeyson    = require('jeyson').create();
const compiled = (template, variables) => jeyson.compile(variables, template);

module.exports = {
  create: (data) => {
    return {
      getRequest: () => {
        return data['request@']
      },
      getResponse: () => {
        return {
          compile : (variables) => {
            const response = data['response@'];
            if(response['stream@']){
              return {
                stream: compiled(response['stream@'], variables),
                doNotRepeat: !!response['doNotRepeat@'],
                streamInterval: response['streamInterval@'],
              }
            }
            return compiled(response, variables);
        }};
      },
    };
  }
}
