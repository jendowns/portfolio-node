var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var sassMiddleware = require('node-sass-middleware');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: __dirname + '/sass', 
  dest: __dirname + '/public/stylesheets',
  prefix:  '/stylesheets',
  debug: true,  
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the 404 page
  res.status(err.status || 404);
  res.render('404');

  // / render the error page
  //res.status(err.status || 500);
  //res.render('error');
});
*/

// ---

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if(err.status && err.status === 404){
    res.render('404');
    return;
  }
  
  // development error handler will print stacktrace,
  // production error handler no stacktraces leaked to user
  var body = {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  };
  res.render('error', body);
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});
