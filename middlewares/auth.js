let express = require('express');
let User = require('../models/User');




module.exports = {
    verifyLoggedInUser :(req,res,next) => {
        if(req.session && req.session.id){
            next();
        }else{
            res.redirect('/user/login')
        }
    },

   currentLoggedInUser :(req,res,next) => {
       if(req.session && req.session.id){
           const userId = req.session.userId;
           User.findById(userId,{name:1,email:1},(err,user) => {
                 req.user = user;
                 next();
           })
       }else{
           req.user = null;
           next();
       }
   }

}