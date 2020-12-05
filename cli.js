const create = require('./create');
const record = require('./record');
const start  = require('./index');

const commandHelpLinks = {
  create: "https://github.com/nishants/grpc-devtool/blob/master/docs/demo/create-new/README.md",
  record: "https://github.com/nishants/grpc-devtool",
  serve : "https://github.com/nishants/grpc-devtool",
};

const helpText = `
Enter a command :
 
grpc-devtool create --protos path/to/protofiles [--out path/to/create]
Read more at ${commandHelpLinks.create}

Record grpc interactions : 
grpc-devtool record my-host.com:8081 [--config path/to/config] [--protos path/to/protofiles ]
Read more at ${commandHelpLinks.record}

Record grpc interactions : 
grpc-devtool serve my-host.com:8081 [--config path/to/config] [--protos path/to/protofiles ]
Read more at ${commandHelpLinks.serve}
`;
const commands = {
  create : (params) => create.run(params),
  record : (params) => record.run(params),
  serve  : (params) => start.run(params),
  undefined : () => console.log(helpText)
};

module.exports = {
  run : (args) => {
    const command = args[2];
    const commandParams = args.slice(3);

    console.log(`Running ${command} with arguments `, commandParams);

    commands[command](commandParams);
  }
};