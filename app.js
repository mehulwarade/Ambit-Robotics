const express = require('express');
const chalk = require('chalk');
const functions = require('./lib/functions');

var config_path = functions.getConfigPath(); /* Always put this after declaring functions */
var data = require('./data.json');
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
  console.log(`Test: ${global_env.app.public_access_DNS}:${port}/?ref=admin`);
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

  if (req.query.ref == 'admin') {
    req.session.isadmin = true;
  }
  else {
    req.session.isadmin = false;
  }
  console.log(req.query);
  res.sendFile(__dirname + '/login.html');

});

app.post('/auth', function (req, res) {
  var username = req.body.username;
  // console.log(username);
  var password = req.body.password;
  // console.log(password);
  if (username && password) {
    if (req.session.isadmin) {
      if (password == global_env.admin.password) {
        req.session.loggedin = true;
        req.session.password = password;
        // res.redirect('/index');
        res.redirect(url.format({
          pathname:"/index",
          query: {
             "err": "noerror",
           }
        }));
      }
      else {
        res.redirect(url.format({
          pathname:"/",
          query: {
            "ref":"admin",
            "err": "Password is wrong for admin.",
           }
        }));
        // res.send('Password is wrong for admin.');
        // res.end();
      }
    }
    else if (username.length == 32) {
      //The following might give error on wrong 32 bit hash
      decryptuser = functions.decrypt(username);

      var data = require(data_path);

      for (index in data) {
        if(data[index].name == decryptuser){
          console.log('user found');

          if(data[index].password == password){
            console.log('user authenticated');
          }
          else{
            res.send('Wrong password for the user.');
            res.end();
          }

        }
        else{
          res.send('No user found.');
          res.end();
        }
        // console.log(data[index].name);
      }

    }
    else {
      res.send('Username Hash value is incorrect.');
      res.end();
    }
  }
  else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

app.get('/index', function (req, res) {

  if (req.session.loggedin) {
    if (req.session.isadmin) {
      console.log('Admin authenticated');
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data, null, 2));
      console.log(req.query);
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
    // console.log(functions.encrypt(data[1].name));
  }

  catch (err) {
    console.log(chalk.red(err));
  }
}

run();