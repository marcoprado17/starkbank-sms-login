const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const httpErrors = require('http-errors-express').default;

const indexRouter = require('./routes/index');
const userSigninRouter = require('./routes/api/rpc/user/signin');
const userLoginRouter = require('./routes/api/rpc/user/login');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Registering routes
app.use('/', indexRouter);
app.use('/api/rpc/user/signin', userSigninRouter);
app.use('/api/rpc/user/login', userLoginRouter);

// Dealing with errors
app.use(httpErrors({
    before: (err, req, isExposed, cb) => {
        if(!'status' in err || err.status === 500 || err.status === "500") {
            console.error("err.code:", err.code);
            console.error("typeof err.code:", typeof err.code);
            console.error("err:", err);
        }
        else {
            console.warn("err:", err);
        }
        cb();
    }
}));

module.exports = app;
