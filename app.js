const express = require('express');
const chalk = require('chalk');
const functions = require('./lib/functions');

var config_path = functions.getConfigPath(); /* Always put this after declaring functions */

/* Checking for configuration file */

if (functions.directoryExists(config_path)) {
  console.log(chalk.green('Configuration file found.'));
  var global_env = require(config_path);
}
else {
  console.log(chalk.red('Configuration file does not exists at ' + config_path));
  process.exit();
}


const app = express();
const port = global_env.app.port
app.listen(port, () => {
  console.log(`API server port: ${port}`);
  console.log(`${global_env.app.public_access_DNS}:${port}`);
  console.log(`Test: ${global_env.app.public_access_DNS}:${port}/?ref=admin`);
});


app.get('/', function(req, res) {
  console.log(req.query);
  res.send('hello' + req);
});