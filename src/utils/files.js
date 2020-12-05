const glob = require('glob');
const fs = require('fs');
const path = require('path');
const os = require('os');
const yaml = require("yaml");

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

const readYamlFileInDir = (dir, filePath) => {
  return readTextFile(path.join(dir, filePath)).then(data => yaml.parse(data));
};

const writeYaml = (dir, file, content) => {
  return writeFile(dir, file, yaml.stringify(content, {indent: 2}));
};

const ensureDirExists = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (error) => {
      if(error){
        return reject(error);
      }
      resolve();
    })
  })
};

const writeFile = (dir, file, content) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (error) => {
      if(error){
        return reject(error);
      }
      fs.writeFile(path.join(dir, file), content, 'utf8', (error) => {
        if(error){
          return reject(error);
        }
        resolve();
      });

    });
  });
}

const createTempDir = (name) => {
  return new Promise((resolve, reject) => {
    fs.mkdtemp(path.join(os.tmpdir(), `name-${Date.now()}`), (error, dir) => {
      if (error) return reject(error);
      resolve(dir)
    });
  });
};

const copyFile = async (from, to) => {
  await ensureDirExists(path.dirname(to));

  return new Promise((resolve, reject) => {
    fs.copyFile(from, to, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};

module.exports = {
  getFilesFromDir,
  readYamlFile,
  readYamlFileInDir,
  writeFile,
  createTempDir,
  writeYaml,
  copyFile
};