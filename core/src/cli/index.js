const create = require('./create');
const record = require('./record');
const serve  = require('./serve');
const version  = require('./get-version');

const commands = {
  init   : (params) => create.run(params),
  record : (params) => record.run(params),
  serve  : (params) => serve.run(params),
  'v'    : () => version.run(),
  '-v'   : () => version.run(),
  version  : () => version.run(),
  '-version'  : () => version.run(),
  '--version'  : () => version.run(),
  help   : () => console.log(helpText),
  '--help'   : () => console.log(helpText),
  '-help'   : () => console.log(helpText),
  '-h'   : () => console.log(helpText),
  undefined : () => console.log(helpText)
};

const commandHelpLinks = {
  init: "https://github.com/nishants/grpc-devtool/blob/master/docs/demo/create-new/README.md",
  record: "https://github.com/nishants/grpc-devtool",
  serve : "https://github.com/nishants/grpc-devtool",
};

const helpText = `
Enter a command :
 
grpc init 
Read more at ${commandHelpLinks.init}

Record grpc interactions : 
grpc record my-host.com:8081 
Read more at ${commandHelpLinks.record}

Record grpc interactions : 
grpc serve my-host.com:8081 path/to/config
Read more at ${commandHelpLinks.serve}
`;

module.exports = {
  run : (args) => {
    const command = args[2];
    const commandParams = args.slice(3);
    (commands[command] || commands.help)(commandParams);
  }
};