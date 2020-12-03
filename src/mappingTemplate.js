
module.exports = {
  create: (data) => {
    return {
      getRequest: () => {
        return data['request@']
      },
      getResponse: () => {
        return {
          compile : () => {
            const response = data['response@'];
            if(response['stream@']){
              return {
                stream: response['stream@'],
                doNotRepeat: !!response['doNotRepeat@'],
                streamDelay: response['streamDelay@'],
              }
            }
            return response;
        }};
      },
    };
  }
}