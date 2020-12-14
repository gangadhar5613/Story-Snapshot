var express = require('express');
var router = express.Router();
let User = require('../models/User');
let flash = require('connect-flash');

router.use(flash());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//register
router.get('/register',(req,res,next) => {
   res.render('register');
})

router.post('/register',(req,res,next) => {   
  User.create(req.body,(err,user) => {
    if(err) return next();
    res.redirect('/userDashboard');
  })
})



//login
router.get('/login',(req,res) => {
  res.render('login');
})

router.post('/login',(req,res,next) => {
 const {email,password} = req.body;
 if(!email || !password){
   //req.flash('flashMsg',Please enter valid email and password)
   res.redirect('/login')
 }
 User.findOne({email},(err,user) => {
    if(err) return next();
    if(!user){
      //req.flash('flashMsg',Please enter valid email and password)
      res.redirect('/login')
    }
    if(!user.verifyPassword(password)){
        //req.flash('flashMsg',Please enter valid details)
        res.redirect('/login')
    }
    req.session.userId = user.id;
    res.redirect('/user/dashboard');
 })
 
})

router.get('/dashboard',(req,res,next) => {
  res.render('userDashboard')
})

module.exports = router;
