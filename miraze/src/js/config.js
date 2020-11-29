const DEFAULT_KEYWORD_SUFFIX = '@';

const config = {
  isKeyWord : (str, keyword) => {
    const regex = `^${keyword}${DEFAULT_KEYWORD_SUFFIX}$`;
    return new RegExp(regex).test(str);
  }
};
module.exports = config;