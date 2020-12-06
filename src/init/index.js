const readLine = require('readline');
const chalk = require('chalk');
const init = require('./init');

module.exports = {
  createProject : async (initialConfig) => {
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

    let nextResolve = null;

    const askUser = (prompt) => {
      return new Promise((resolve) => {
        nextResolve = resolve;
        if(prompt.error){
          console.log(chalk.red(prompt.error));
        }
        if(prompt.question){
          console.log(chalk.green(prompt.question));
        }
        if(prompt.default){
          console.log(chalk.dim(prompt.default));
        }
      });
    };

    cli.on('line', (userInput) => {
      if(nextResolve) nextResolve(userInput);
    });

    process.setMaxListeners(0);
    let config = {...initialConfig};
    while(states.length){
      const next = await states.pop().create(config);
      while(next.needsMoreInput()){
        const input = await askUser(next.getNextInputQuestion());
        await next.addInput(input);
      }
      config = next.getConfig();
    }
    cli.close();
    await init.create(config);
  }
}