const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
var mung = require('express-mung');

const indexRouter = require('./routes/index');
const signinRouter = require('./routes/signin');
const loginRouter = require('./routes/login');

const blockSettingPrivateFieldsExternallyMiddleware = require('./middlewares/blockSettingPrivateFieldsExternally');
const removeResponsePrivateFieldsMiddleware = require('./middlewares/removeResponsePrivateFields');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to access response body object and remove fields that start with '__'
app.use(mung.json(
    function transform(body, req, res) {
        return removeResponsePrivateFieldsMiddleware(body);
    }
));

// Blocking requests that try setting a private field (starts with '_')
app.use('/', blockSettingPrivateFieldsExternallyMiddleware);

// Registering routes
app.use('/', indexRouter);
app.use('/signin', signinRouter);
app.use('/login', loginRouter);

module.exports = app;
