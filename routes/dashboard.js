var express = require('express');
var router = express.Router();
const auth = require('../middlewares/auth');
const Story = require('../models/story');

/* GET home page. */
router.get('/', auth.verifyLoggedInUser ,(req, res, next) =>{

   const authorId = req.user;
  console.log(authorId);
  Story.find({author : authorId}).populate('author').exec((err,stories) => {
    if(err) return next();
    res.render('userDashboard',{ stories : stories});
    console.log(stories);
  } )
 

  
  
});





module.exports = router;
