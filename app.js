const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require("morgan")
const env = require('dotenv');
const bodyParser = require('body-parser')
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const multer = require('multer');
const auth = require('./middlewares/auth');

//config doenv 
env.config();


// conncting to mongodb using mongoose
mongoose.connect(process.env.MONGODB_URL,{useUnifiedTopology:true,useNewUrlParser:true},
(err) => {
  console.log(err ? err : 'Database is connected');
});


// starting of server
const app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//middlewares
app.use(logger("tiny"))
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
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
app.use('/',auth.currentLoggedInUser, require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/stories',require('./routes/stories'));
app.use('/dashboard',require('./routes/dashboard'));
app.use('/logout',require('./routes/logout'));





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
