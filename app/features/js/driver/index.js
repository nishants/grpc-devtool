// const {BrowserWindow, app} = require("electron");
// const pie = require("puppeteer-in-electron")
// const puppeteer = require("puppeteer-core");
//
// const main = async () => {
//   await pie.initialize(app);
//   const browser = await pie.connect(app, puppeteer);
//
//   const window = new BrowserWindow();
//   const url = "https://example.com/";
//   await window.loadURL(url);
//
//   const page = await pie.getPage(browser, window);
//   console.log(page.url());
//   window.destroy();
// };
//
// main();

const electron = require("electron-forge");
const kill = require("tree-kill");
const puppeteer = require("puppeteer-core");
const { spawn } = require("child_process");

const port = 9200; // Debugging port
const timeout = 20000; // Timeout in miliseconds
let page;
let pid;


const run = async () => {
  const startTime = Date.now();
  let browser;

  // Start Electron with custom debugging port
  pid = spawn(electron, [".", `--remote-debugging-port=${port}`], {
    shell: true
  }).pid;

  // Wait for Puppeteer to connect
  while (!browser) {
    try {
      browser = await puppeteer.connect({
        browserURL: `http://localhost:${port}`,
        defaultViewport: { width: 1000, height: 600 }
      });
      [page] = await browser.pages();
    } catch (error) {
      if (Date.now() > startTime + timeout) {
        throw error;
      }
    }
  }
};

run();
