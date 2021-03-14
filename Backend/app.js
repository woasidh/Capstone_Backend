var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

require('dotenv').config();

// Mongoose 연결
const mongoose = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

mongoose.connect('mongodb://3.133.119.255:27017/cabstone', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
/*
mongoose.connect('mongodb://localhost:27017/cabstone', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
*/
const connection = mongoose.connection;
mongooseAutoInc.initialize(connection);

connection.on('error', console.error);
connection.once('open', () => {
    console.log('Connected to mongoDB server');
})

// Router 설정
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Swagger Setting
const { swaggerUi, specs } = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Cors Setting
app.use(cors());
app.options('*', cors());

// Session Setting
app.use(session({
    key: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60
    }
}));

// Passport for google login
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
