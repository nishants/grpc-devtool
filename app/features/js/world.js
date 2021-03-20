const { setWorldConstructor } = require("@cucumber/cucumber");

class CustomWorld {
  constructor() {
    this._ = {};
    this._.driver = {name: "electron"};
  }

  setTestInfo(info) {
    this._.testInfo = info;
  }

  getTestInfo(){
    return this._.testInfo;
  }
}

setWorldConstructor(CustomWorld);
