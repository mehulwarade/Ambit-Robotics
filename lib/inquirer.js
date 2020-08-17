const inquirer = require('inquirer');
const functions = require('./functions');

var config_path = functions.getConfigPath(); /* Always put this after declaring functions */
global_env = require(config_path);

var prefix = '<== ---------------xx--------------- ==>'

module.exports = {
    ask_main: () => {
        return inquirer.prompt({
            type: 'rawlist',
            name: 'res',
            prefix: prefix,
            message: '\nWelcome to admin portal.',
            choices: ['Generate new data','Database']
        });
    }
};
