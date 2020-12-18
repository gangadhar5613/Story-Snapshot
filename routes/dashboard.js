var express = require('express');
var router = express.Router();
const auth = require('../middlewares/auth');
const Story = require('../models/story');
const User = require('../models/User');

/* GET home page. */
router.get('/', auth.verifyLoggedInUser ,(req, res, next) =>{

   const authorId = req.user;
  console.log(authorId);
  Story.find({author : authorId}).populate('author').exec((err,stories) => {
    User.findById(authorId,(err,user) => {
      if(err) return next();
      res.render('userDashboard',{ stories : stories,currentUser: user});
      console.log(stories);
      console.log(user);
    })
    
  } )
 

  
  
});





module.exports = router;
