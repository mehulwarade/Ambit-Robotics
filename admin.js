const chalk = require('chalk');
const clear = require('clear');

const functions = require('./lib/functions');

var config_path = functions.getConfigPath(); /* Always put this after declaring functions */

clear();

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

const run = async () => {

    try {

        console.log(functions.getCSVFileList());

        var hw = functions.encrypt("Somsssse serious stuff")
        console.log(hw)
        console.log(functions.decrypt(hw))

    }

    catch (err) {
        console.log(chalk.red(err));
    }

}

run();