const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');

global_env = require(process.cwd() + '/configuration.json');

// https://www.npmjs.com/package/clui
const CLI = require('clui');
const Spinner = CLI.Spinner;

const spin = new Spinner();

// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

//https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options
//https://codeforgeek.com/encrypt-and-decrypt-data-in-node-js/ 
const key = Buffer.from(global_env.crypto.key, 'utf8');
const iv_string = global_env.crypto.iv;

module.exports = {
  getCurrentDirectory: () => {
    return process.cwd();
  },

  getConfigPath: () => {
    return process.cwd() + '/configuration.json';
  },

  getDataPath: () => {
    return process.cwd() + '/data.json';
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

  encrypt:(text)=>{
    const ive = Buffer.from(iv_string, 'utf8');
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), ive);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  },

  decrypt:(text)=>{
    try{
      let ivd = Buffer.from(iv_string, 'utf8');
      let encryptedText = Buffer.from(text, 'hex');
      let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivd);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    }
    catch(err){
      console.log(chalk.red('Decrypt Failed'));
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

