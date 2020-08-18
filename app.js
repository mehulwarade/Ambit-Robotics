const express = require('express');
const chalk = require('chalk');
const functions = require('./lib/functions');

var config_path = functions.getConfigPath(); /* Always put this after declaring functions */
var data = require('./data.json');

//#region Checking existence of files
/* Checking for configuration file */

if (functions.directoryExists(config_path)) {
  console.log(chalk.green('Configuration file found.'));
  var global_env = require(config_path);
}
else {
  console.log(chalk.red('Configuration file does not exists at ' + config_path));
  process.exit();
}

/* Checking for existance of csv folder */

if (functions.directoryExists(global_env.app.csv_folder)) {
  console.log(chalk.green('CSV folder exists'));
}
else {
  console.log(chalk.red('No folder for CSV files at: ' + global_env.app.csv_folder));
  process.exit();
}

/* Checking for existance of data.json */
var data_path = functions.getDataPath()
if (functions.directoryExists(data_path)) {
  console.log(chalk.green('data.json exists'));
  var data = require(data_path);
}
else {
  console.log(chalk.red('No folder for CSV files at: ' + data_path));
  process.exit();
}
//#endregion

/* Web app */
const app = express();
const port = global_env.app.port
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');
app.use('/', express.static(__dirname));

app.listen(port, () => {
  console.log(`API server port: ${port}`);
  console.log(`${global_env.app.public_access_DNS}:${port}`);
  adminloginlink = `${global_env.app.public_access_DNS}:${port}/?ref=${functions.encrypt(global_env.admin.username)}&auth=${functions.encrypt(global_env.admin.password)}`;
  console.log(`Admin Admin: ${adminloginlink}`);
  console.log(`Test-mehul: ${data[1].url}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
  req.session.loggedin = false;

  if (req.query.ref.length == 32 && functions.decrypt(req.query.ref)) {

    if (functions.decrypt(req.query.ref) == global_env.admin.username) {
      
      console.log('Ref Key Valid: Admin login! Redirecting...');
      req.session.isadmin = true;

      if (functions.decrypt(req.query.auth) == global_env.admin.password) {
      
        console.log('Auth Key Valid: Authenticated! Redirecting...');
        req.session.loggedin = true;
        req.session.isadmin = true;
        // res.send('Auth Key Valid: Authenticated! Redirecting...');
        res.redirect('/index');
      }
      else {
        res.send('Auth key invalid! Try again');
        console.log('Auth key invalid! Try again');
        req.session.loggedin = false;
        req.session.isadmin = false;
        res.end();
      }
    }
    else {
      console.log('Ref Key Valid: User login! Redirecting...');
      req.session.isadmin = false;


    }
  }
  else{
    res.send('Ref key invalid! Try again');
      console.log('Ref key invalid! Try again');
      req.session.isadmin = false;
      res.end();
  }
});

app.get('/index', function (req, res) {

  if (req.session.loggedin) {
    if (req.session.isadmin) {
      console.log('Admin authenticated');
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data, null, 2));
      // console.log(req.query);
    }
    else {
      res.redirect('/');
    }
  }
});

app.get('/*', function (req, res) {
  res.redirect('/');
});
/* First run everytime we start to update data.json */

const run = async () => {

  try {
    // console.log(data);
    // console.log(functions.getCSVFileList());
    //https://stackoverflow.com/a/23552761
    // console.log(functions.encrypt('testpas'));
  }

  catch (err) {
    console.log(chalk.red(err));
  }
}

run();