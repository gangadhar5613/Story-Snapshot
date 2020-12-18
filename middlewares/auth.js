let express = require('express');
let User = require('../models/User');




module.exports = {
    verifyLoggedInUser :(req,res,next) => {
        if(req.session  && req.session.userID ){
            console.log('from session' + req.session);
            req.user = req.session.userID;
            console.log(req.user)
            console.log('hello in auth')
            next();
        }else{
            res.redirect('/user/login')
            next();
        }
    },

   currentLoggedInUser :(req,res,next) => {
       if(req.session && req.session.userID){
           const userId = req.session.userID;
           User.findById(userId,{name:1,email:1},(err,user) => {
                 req.user = user;
                 next();
                 console.log('from current' + req.user)
                 console.log('user id'+ req.user)
           })
       }else{
           req.user = null;
           next();
       }
   }

}