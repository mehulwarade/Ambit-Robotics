const fs = require('fs');
const path = require('path');
const _ = require('lodash');

global_env = require(process.cwd() + '/configuration.json');

// https://www.npmjs.com/package/clui
const CLI = require('clui');
const Spinner = CLI.Spinner;

const spin = new Spinner();

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  getConfigPath: () => {
    return process.cwd() + '/configuration.json';
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },

  getCSVFileList:()=>{
    const filelist = _.without(fs.readdirSync(global_env.app.csv_folder));
    if (filelist.length) {
        return filelist;
      } else {
        console.log('no files');
      }
  },

  spinnerStart: (msg) => {
    spin.message(msg);
    spin.start();
  },

  spinnerStop: () => {
    spin.stop();
  },

  delay: (time) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), time)
  })
  }

};
