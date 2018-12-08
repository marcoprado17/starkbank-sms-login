//Import the mongoose module
const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongodb/${process.env.DB_DATABASE}?authSource=admin`;
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection

const db = mongoose.connection;

module.exports = db;
