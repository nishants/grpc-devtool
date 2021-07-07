const { setWorldConstructor } = require("@cucumber/cucumber");
const Driver = require("./driver");

class CustomWorld {
  constructor() {
    this._ = {
      driver : Driver.create()
    };
  }

  getDriver() {
    return this._.driver;
  }

  setTestInfo(info) {
    this._.testInfo = info;
  }

  getTestInfo(){
    return this._.testInfo;
  }
}

setWorldConstructor(CustomWorld);
