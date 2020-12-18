var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let loginStatus ;
  if(req.session.userID == undefined){
    loginStatus = 'login';
  }else{
    loginStatus = 'dashboard'
  }
  console.log('session id ' + req.session.userID)
  res.render('index', { status : loginStatus  });
  console.log(loginStatus)
});




module.exports = router;
