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

  if (req.query.ref.length == 32 && functions.decrypt(req.query.ref) && functions.decrypt(req.query.auth)) {
    decryptuser = functions.decrypt(req.query.ref);
    decryptauth = functions.decrypt(req.query.auth);

    if (decryptuser == global_env.admin.username) {

      console.log('Ref Key Valid: Admin login! Redirecting...');
      req.session.isadmin = true;

      if (decryptauth == global_env.admin.password) {

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

      var data = require(data_path);

      for (index in data) {
        if (data[index].name == decryptuser) {
          // console.log('user found');

          if (data[index].password == decryptauth) {
            // res.write('Auth Key Valid: User Authenticated! Redirecting...');
            console.log('Auth Key Valid: User Authenticated! Redirecting...');
            req.session.loggedin = true;
            //https://stackoverflow.com/a/19038048
            res.redirect(url.format({
              pathname: "/index",
              query: {
                "ref": decryptuser
              }
            }));

          }
          else {
            res.send('Wrong password for the user.');
            console.log('Wrong password for the user.');
            req.session.loggedin = false;
            res.end();
          }
        }
      }
      res.write('No user found in database.');
      console.log('No user found in database.');
      req.session.loggedin = false;
      res.end();
    }
  }
  else {
    res.send('Invalid keys! Try again');
    console.log('Invalid keys! Try again');
    req.session.isadmin = false;
    req.session.loggedin = false;
    res.end();
  }
});

app.get('/index', function (req, res) {

  if (req.session.loggedin) {
    if (req.session.isadmin) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data, null, 2));
      // console.log(req.query);
    }
    else {

      // res.setHeader('Content-Type', 'application/json');
      // res.end(JSON.stringify(data, null, 2));
      res.end(req.query.ref);
      console.log(req.query);
      // res.redirect('/');
    }
  }
});

app.get('/*', function (req, res) {
  res.redirect('/');
});

/* First run everytime we start to update data.json */

const editJsonFile = require("edit-json-file");
let file = editJsonFile(`${__dirname}/data.json`, {
  autosave: true
});

const { values } = require('lodash');

var csv = require("fast-csv");
const fs = require('fs');
const { exit } = require('process');
const { callbackify } = require('util');

var lines_to_skip = 10 /* Fill this when the file does not directly start with the data. Start counting the file from 0 */
var currentline = 0
var tempdata = []

const run = async () => {

  try {
    // console.log(data);
    // console.log(functions.getCSVFileList());
    //https://stackoverflow.com/a/23552761
    // console.log(functions.encrypt('testpas'));

    var index = functions.getCSVFileList().length;
    a = 0
    while (a < index) {
      await storedata(1);
      a++;
    }

    // for (i in functions.getCSVFileList()) {


    // }
  }

  catch (err) {
    console.log(chalk.red(err));
  }
}

run();

async function storedata(i) {
  var index = 0;
  for (val in data) {
    index += 1;
  }
  console.log(index);
  nextval = index + 1;

  console.log(functions.getCSVFileList()[i]);
  const stream = fs.createReadStream(global_env.app.csv_folder + '/' + functions.getCSVFileList()[i]);
  await csv.parseStream(stream)
    .on("data", row => {
      if (currentline == 0) {
        tempdata.push([row[0], row[1]]);
        // console.log(row[0]);
        currentline += 1
      }
    })
    .on("end", async rowCount => {
      console.log(`Parsed ${rowCount} rows`)
      console.log(tempdata);

      for (z in data) {
        console.log(z)

        if (tempdata[0][1] == data[z].name) {
          console.log('yes duplicate found');
          await file.set(`${z}.spray_number`, data[z].spray_number + 1);
          await file.set(`${z}.run.${data[z].spray_number + 1}.fname`, functions.getCSVFileList()[i]);

        }
        else {
          await file.set("" + nextval, {
            name: tempdata[0][1],
            password: tempdata[0][1] + nextval,
            url: adminloginlink = `${global_env.app.public_access_DNS}:${port}/?ref=${functions.encrypt(tempdata[0][1])}&auth=${functions.encrypt(tempdata[0][1] + nextval)}`,
            fname: functions.getCSVFileList()[i]
          });
        }
      }


    })
    .on('error', error => console.error(error));
}