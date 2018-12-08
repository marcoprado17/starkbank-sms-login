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

//middleware to access response body object and remove fields that start with '__'
// app.use(mung.json(
//     function transform(body, req, res) {
//         return removeResponsePrivateFieldsMiddleware(body);
//     }
// ));

app.use('/', blockSettingPrivateFieldsExternallyMiddleware);

app.use('/', indexRouter);
app.use('/signin', signinRouter);
app.use('/login', loginRouter);

app.use('/', removeResponsePrivateFieldsMiddleware);

module.exports = app;
