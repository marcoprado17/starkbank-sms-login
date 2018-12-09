//Import the mongoose module
const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoConnectionString = require('./mongoConnectionString');
mongoose.connect(mongoConnectionString);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection

const mongodb = mongoose.connection;

module.exports = mongodb;
