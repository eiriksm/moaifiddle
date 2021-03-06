var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var editor = require('./routes/edit');
var runner = require('./routes/runner');

var app = express();
var fs = require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.set('layout','layout');
app.engine('hjs', require('hogan-express'));
app.use(favicon());

app.use(logger('dev'));
app.use(express.compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//shim for our moaijs.js file
app.use(function(req, res, next) {
    if (req.url == '/moaijs/moaijs.js') {
        req.url = '/moaijs/moaijs.js.noide';
        res.setHeader('Content-Type','application/javascript'); //to get zip support
    }
    next();
 });

app.use(express.static(path.join(__dirname, 'public')));


app.use(app.router);
app.post('/snippet/edit', editor.show);
app.post('/snippet', runner.snippet);
app.post('/run', runner.index);
app.get('/run', runner.index);
app.get('/:slug/:revision/embed', runner.embed);
app.get('/:slug/:revision', editor.show);
app.get('/:slug', editor.show);
app.get('/', editor.show);

app.post('/:slug/:revision', editor.save);
app.post('/:slug', editor.save);
app.post('/',editor.save);


/// catch 404 and forwarding to error handler
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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
