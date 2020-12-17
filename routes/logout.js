var express = require('express');
var router = express.Router();
const session = require('express-session');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  req.session.destroy((err) => {
      if(err) return next();
      res.redirect('/user/login')
      
      console.log('dupli');
      next();

  })
});

module.exports = router;
