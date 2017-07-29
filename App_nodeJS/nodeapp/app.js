var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//db connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://localhost:27017/Test');
console.log("db"+db);
var routes = require('./routes/index');
var users = require('./routes/users');
var morgan       = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var funct = require('./routes/index.js');
/*var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
  ],
  exitOnError: false
});
*/
/*var logger = exports;
  logger.debugLevel = 'warn';
  logger.log = function(level, message) {
    var levels = ['error', 'warn', 'info'];
    if (levels.indexOf(level) >= levels.indexOf(logger.debugLevel) ) {
      if (typeof message !== 'string') {
        message = JSON.stringify(message);
      };
      console.log(level+': '+message);
    }
  }*/
 /* var log4js = require('log4js');
log4js.configure({
    appenders: [{type: 'console'},
                {type: 'file', filename: 'express.log', category: 'dev'}]
});

var logger = log4js.getLogger('dev');
logger.setLevel('DEBUG');

app.use(log4js.connectLogger(logger, {level: log4js.levels.DEBUG}));
*/
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "inalanandita@gmail.com",
        pass: "9676910694"
    }
});
console.log("routes"+routes);
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'iamscotch',
    saveUninitialized: true,
    resave: true})); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session
var Account = require('./routes/index');
passport.authenticate("local-signup");
//passport

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', routes);
app.use('/users', users);

/*app.use(passport.initialize());
app.use(passport.session());*/

//app.use('/timeup',timeup);

// Use the LocalStrategy within Passport to register/"signup" users.


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
