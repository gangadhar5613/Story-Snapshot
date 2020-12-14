const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);


//conncting to mongodb using mongoose
mongoose.connect('mongodb://localhost/story-snapshot',{useUnifiedTopology:true,useNewUrlParser:true},
(err) => {
  console.log(err ? err : 'Database is connected');
});


// starting of server
const app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret:'secret about application',
  saveUninitialized:false,
  resave:false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(express.static(path.join(__dirname, 'public')));



//routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
