const path = require("path");

const pricesProject = {
  root : path.join(__dirname, './prices-project'),
  configPath : path.join(__dirname, './prices-project/config'),
  protosPath : path.join(__dirname, './prices-project/protos'),
  protos: {
    greet: path.join(__dirname, './prices-project/protos/greet.proto'),
    helloworld: path.join(__dirname, './prices-project/protos/helloworld.proto'),
    prices: path.join(__dirname, './prices-project/protos/prices.proto'),
  }
};

module.exports = {
  pricesProject
};
