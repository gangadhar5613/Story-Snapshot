var express = require('express');
var router = express.Router();
let User = require('../models/User');
let Comment = require('../models/Comment');
const auth = require('../middlewares/auth');


router.post('/:id',auth.verifyLoggedInUser,(req,res,next) => {

  let id = req.params.id;
  req.body.articleId = id;
  let currentUser = req.user;
  req.body.authorId = currentUser;

    Comment.create(req.body,(err,comment) => {
      if(err) return next();       
        res.redirect(`/stories/${id}`);
        next();
      })   
})



module.exports = router;