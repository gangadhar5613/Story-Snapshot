const express = require('express');
const router = express.Router();
const User = require('../models/User');
const flash = require('connect-flash');
const auth = require('../middlewares/auth')

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
    res.redirect('/user/login');
    console.log(user);
  })
})



//login
router.get('/login',(req,res) => {
  // let flashMessage = req.flash('flashMsg')
  res.render('login' );
})

router.post('/login',(req,res,next) => {
 const {email,password} = req.body;
 if(!email || !password){
  //  req.flash('flashMsg',"Please enter valid email and password")
   res.redirect('/user/login')
 }
 User.findOne({email},(err,user) => {
    if(err) return next();
    if(!user){
      // req.flash('flashMsg',"Please enter valid email and password")
      res.redirect('/user/login')
    }
    if(!user.verifyPassword(password)){
        // req.flash('flashMsg',"Please enter valid details")
       return res.redirect('/user/login')
    }
    req.session.userId = user.id;
    res.redirect('/dashboard');
    console.log(req.session.userId)
 })
 
})






//dashboard

module.exports = router;
