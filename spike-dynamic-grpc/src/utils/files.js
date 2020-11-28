const glob = require('glob');
const fs = require('fs');
var yaml = require("yaml");

const getFilesFromDir = (pattern) => {
  return new Promise((resolve, reject) => {
    const callback = (error, files) => {
      if(error){
        return reject(error);
      }
      resolve(files)
    };

    glob(pattern, {}, callback);
  });
};

const readTextFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, {encoding: 'utf-8'}, (error,data) => {
      if (error) {
        return reject(error)
      }
      resolve(data);
    });
  });
};

const readYamlFile = (filePath) => {
  return readTextFile(filePath).then(data => yaml.parse(data));
};

module.exports = {
  getFilesFromDir,
  readYamlFile
};