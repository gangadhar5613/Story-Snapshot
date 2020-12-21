const express = require('express');
const router = express.Router();
const User = require('../models/User');
const flash = require('connect-flash');
const auth = require('../middlewares/auth');
let Story = require('../models/story');
const { count } = require('../models/User');
const multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/images/upload');
   },
  filename: function (req, file, cb) {
      cb(null , file.originalname);
  }
});
var upload = multer({ storage : storage })






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
    req.session.userID = user.id;
    res.redirect(`/user/profile/${req.session.userID}`);
    console.log(req.session.userId)
 })
 
})



//user profile
router.get('/profile/:id',auth.verifyLoggedInUser,(req,res,next) => {
  let id = req.params.id;
  let currentUser = req.user;
  console.log('current user' + req.user);
  User.findById(id,(err,user) => {
    Story.find({author : id },(err,stories) => {
     
       
            console.log('total stories '+ stories.length);
            if(err) return next();
            res.render('userProfile',{user: user,stories: stories});
      
    })
    
  })
 
  
})


router.post('/profile/:id',upload.single('profilePic'),auth.verifyLoggedInUser,(req,res,next) => {
  let id = req.params.id;
  req.body.profilePic = req.file.filename;
  User.update({_id : id},{$set : {profilePic : req.body.profilePic}},(err,updatedUser) => {
    console.log('here is the updated user',updatedUser);
    if(err) return next();
    res.redirect(`/user/profile/${id}`);
    
  })
  


})

//dashboard

module.exports = router;
