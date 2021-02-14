const mustache = require('mustache');

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
                stream: response['stream@'],
                doNotRepeat: !!response['doNotRepeat@'],
                streamInterval: response['streamInterval@'],
              }
            }
            const compiled = JSON.parse(mustache.render(JSON.stringify(response), variables))
            return compiled;
        }};
      },
    };
  }
}
