var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

var dati=require('./lib/dati')

var app = express();
var http = require('http').createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);

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

var io = require('socket.io')(http,{path:"socket"});

http.listen(3008, function(){
  console.log('listening on *:3008');
});

io.on('connection', function(socket){

  console.log('a user connected');

  socket.on('hi', function(msg){
    console.log('message: ' + msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

// var WebSocketServer = require('ws').Server
// var wss = new WebSocketServer({ server: http  })

// wss.on('connection', function connection(ws) {
//   var location = url.parse(ws.upgradeReq.url, true);
//   // you might use location.query.access_token to authenticate or share sessions
//   // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
//   console.log('连上了');
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });

//   ws.send('something');
// });


//module.exports = app;
