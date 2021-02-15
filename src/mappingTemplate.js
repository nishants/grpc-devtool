const mustache = require('mustache');

const compiled = (template, variables) => JSON.parse(mustache.render(JSON.stringify(template), variables));

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
