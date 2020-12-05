const init = require('../init/init');

module.exports = {
  run : (params) => {
    init.create({
      outputDir: "/Users/dawn/Desktop/NewProject",
      protosPath: "/Users/dawn/Desktop/Protobuf"
    })
  }
};