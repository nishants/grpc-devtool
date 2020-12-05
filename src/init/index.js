const readLine = require('readline');

const states = [
  require('./interactive/GetOutputDir')
];

const cli = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const askUser = (question) => {
  return new Promise((resolve) => {
    cli.question(question, (userInput) => {
      resolve(userInput)
    });
  });
};

(async () => {
  let config = {};
  while(states.length){
    const next = states.pop().create(config);
    while(next.needsMoreInput()){
      const input = await askUser(next.getNextInputQuestion());
      next.addInput(input);
    }
    config = next.getConfig();
  }
  cli.close();
  console.log("Ready with configuration", config);
})();

console.log("yeah")