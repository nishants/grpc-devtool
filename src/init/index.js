const readLine = require('readline');
const chalk = require('chalk');

const states = [
  require('./interactive/SelectProtosToMap'),
  require('./interactive/CreateDefaultMappings'),
  require('./interactive/GetProtosPath'),
  require('./interactive/GetHostConfig'),
  require('./interactive/GetOutputDir'),
];

const cli = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const askUser = (prompt) => {
  return new Promise((resolve) => {
    if(prompt.error){
      console.log(chalk.red(prompt.error));
    }
    if(prompt.question){
      console.log(chalk.green(prompt.question));
    }
    if(prompt.default){
      console.log(chalk.dim(prompt.default));
    }

    cli.on('line', (userInput) => {
      resolve(userInput);
    });
  });
};

(async () => {
  let config = {};
  while(states.length){
    const next = states.pop().create(config);
    while(next.needsMoreInput()){
      const input = await askUser(next.getNextInputQuestion());
      await next.addInput(input);
    }
    config = next.getConfig();
  }
  cli.close();
  console.log("Ready with configuration", config);
})();