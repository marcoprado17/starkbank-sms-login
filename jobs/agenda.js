// Registering jobs with agenda lib
const Agenda = require('agenda');
const mongoConnectionString = require('../database/mongoConnectionString');
const agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.define('send SMSs', {concurrency: 1, lockLimit: 1}, require('./sendSmss'));

init = async () => {
    console.log("Starting agenda");
    await agenda.start();
    await agenda.every('1 second', 'send SMSs');
};

module.exports = {
    init,
    agenda
};
