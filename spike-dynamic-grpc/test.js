const path = require('path');

const server = require('./src/server/endpoint-server');

const greet = path.join(__dirname , './protos/helloworld.proto');

var service = server.create({host: "0.0.0.0", port: "50053"});

service.add(greet, (call, callback) => {
  callback(null, {message: 'I am loving it bros :  ' + call.request.name});
  setTimeout(() => {
    console.log("shutting down...");
    service.stop();
  }, 1000);
});

service.start();