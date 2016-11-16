

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var glob = require('glob');
var mongoose = require('mongoose');
// var everyauth = require('everyauth');
var session = require('express-session');


var routes = require('./routes/index');
var chat = require('./routes/chat');
var rooms = require('./routes/rooms');

var config = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/models/*.js');
models.forEach(function (model) {
  require(model);
});

// everyauth.debug = true;
// everyauth.twitter

var app = express();

app.io = require('socket.io')();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({secret: '04f9b23c-9b91-4047-b506-515590091cb2',resave: true, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
// app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
// app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts')); // font awesome Fonts
// app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css')); // font awesome css

app.use('/', routes);
app.use('/rooms', rooms);
app.use('/chat',chat);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

// app.io.on('connection', function(socket){
//   console.log('a user connected');
//   app.io.emit('chat message', 'Hello!');

//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });

//   socket.on('chat message', function(msg){
//     app.io.emit('chat message', msg);
//   });
// });

// usernames which are currently connected to the chat
var usernames = {};

app.io.sockets.on('connection', function (socket) { 

    socket.on('sendchat', function (data) { 
        app.io.sockets.emit('updatechat', socket.username, data);
    }); 

    // when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		app.io.sockets.emit('updateusers', usernames);
	});

    socket.on('disconnect', function() {
        // remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		app.io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
});

module.exports = app;
